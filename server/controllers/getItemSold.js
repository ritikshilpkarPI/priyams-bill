const { isValidObjectId } = require('mongoose');
const PurchaseOrder = require('../db-models/purchase-order-model');
const { Bill } = require('../db-models/bill-model');
const { generateIntervals, groupByFilter } = require('../util/helper');
const { convertToISTAndISO } = require('../util/convertToISTandISO');
const { messages } = require('../constants/messages');

const getItemSold = async (req, res) => {
  const id = req.params.id;
  const { startDate, endDate, filter } = req.query;

  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        error: messages.INVALID_ID_FORMAT,
      });
    }
    if (!startDate || !endDate) {
      return res.status(400).json({
        error: messages.MISSING_REQUIRED_FIELDS,
      });
    }
    if (!filter) {
      return res.status(400).json({
        error: messages.MISSING_FILTER_FIELD,
      });
    }
    const purchaseOrder = await PurchaseOrder.findById(id).select(
      'purchasedItems approveTime'
    );

    if (!purchaseOrder) {
      return res.status(404).json({
        error: messages.PURCHASE_ORDER_NOT_FOUND,
      });
    }

    const approvedTime = purchaseOrder.approveTime;
    const itemMap = {};
    purchaseOrder.purchasedItems.forEach((item) => {
      itemMap[item.item_id.toString()] = item.inputName;
    });

    const now = new Date();
    const last30Days = convertToISTAndISO(
      new Date(now.setDate(now.getDate() - 30))
    );

    const items = Object.keys(itemMap);

    if (items.length === 0) {
      return res.status(404).json({
        message: 'No items found in purchase order',
        success: false,
      });
    }

    const bills = await Bill.find({
      'items.itemDetail': { $in: items },
      createdAt: { $gt: approvedTime },
    }).select('items.itemDetail items.itemQuantityInBill createdAt');
    const start = convertToISTAndISO(startDate);
    const end = convertToISTAndISO(endDate);

    const billsFilter = await Bill.find({
      'items.itemDetail': { $in: items },
      createdAt: { $gte: start, $lte: end },
    }).select('items.itemDetail items.itemQuantityInBill createdAt');

    const groupedData = {};
    billsFilter.forEach((bill) => {
      bill.items.forEach((item) => {
        const itemId = item.itemDetail.toString();
        const itemName = itemMap[itemId];
        const billDate = new Date(bill.createdAt);
        const formattedBillDate = convertToISTAndISO(billDate);
        const groupKey = groupByFilter(formattedBillDate, filter);

        if (itemName && groupKey) {
          if (!groupedData[itemName]) {
            groupedData[itemName] = {};
          }
          groupedData[itemName][groupKey] =
            (groupedData[itemName][groupKey] || 0) + item.itemQuantityInBill;
        }
      });
    });

    const allIntervals = generateIntervals(start, end, filter);

    const totalItemQuantity = {};

    bills.forEach((bill) => {
      bill.items.forEach((item) => {
        const itemId = item.itemDetail.toString();
        const itemName = itemMap[itemId];
        if (itemName) {
          totalItemQuantity[itemName] =
            (totalItemQuantity[itemName] || 0) + item.itemQuantityInBill;
        }
      });
    });

    const lastPurchaseOrders = await Promise.all(
      items.map(async (itemId) => {
        const fetchPurchaseOrder = async (itemId, skipCount) => {
          try {
            return await PurchaseOrder.findOne({
              'purchasedItems.item_id': itemId,
            })
              .sort({ createdAt: -1 })
              .skip(skipCount)
              .select('purchasedItems createdAt approveTime');
          } catch (err) {
            console.error(`${PURCHASE_ORDER_ITEM_FETCH_ERROR} ${itemId}:`, err);
            return null;
          }
        };

        const lastOrder = await fetchPurchaseOrder(itemId, 0);
        const secondLastOrder = await fetchPurchaseOrder(itemId, 1);
        const thirdLastOrder = await fetchPurchaseOrder(itemId, 2);
        const extractOrderDetails = (purchaseOrder) => {
          if (!purchaseOrder)
            return { approvalDate: null, amount: 0, costPrice: 0 };
          const matchedItem = purchaseOrder.purchasedItems.find(
            (item) => item.item_id === itemId
          );
          return {
            approvalDate: purchaseOrder.approveTime || null,
            amount: matchedItem ? matchedItem.itemQuantity || 0 : 0,
            costPrice: matchedItem ? matchedItem.costPrice || 0 : 0,
          };
        };

        return {
          item_id: itemId,
          lastPurchaseOrder: extractOrderDetails(lastOrder),
          lastSecondPurchaseOrder: extractOrderDetails(secondLastOrder),
          lastThirdPurchaseOrder: extractOrderDetails(thirdLastOrder),
        };
      })
    );

    const billsLast30Days = await Bill.find({
      'items.itemDetail': { $in: items },
      createdAt: { $gte: last30Days },
    }).select('items.itemDetail items.itemQuantityInBill createdAt');

    const itemQuantities = {};

    billsLast30Days.forEach((bill) => {
      bill.items.forEach((item) => {
        const itemId = item.itemDetail.toString();
        const billDate = new Date(bill.createdAt);

        if (items.includes(itemId)) {
          itemQuantities[itemId] = itemQuantities[itemId] || {
            last30Days: 0,
          };

          if (billDate >= last30Days) {
            itemQuantities[itemId].last30Days += item.itemQuantityInBill;
          }
        }
      });
    });
    const responseData2 = Object.entries(groupedData).map(
      ([itemName, data]) => {
        const groupedArray = allIntervals.map((interval) => ({
          date: interval,
          value: data[interval] || 0,
        }));
        return {
          itemName,
          groupedData: groupedArray,
        };
      }
    );
    const responseData = items.map((itemId) => {
      const itemName = itemMap[itemId];
      const itemData = itemQuantities[itemId] || {
        last30Days: 0,
      };

      const lastPurchaseOrderData = lastPurchaseOrders.find(
        (order) => order.item_id === itemId
      );
      const groupedArray = allIntervals.map((interval) => ({
        date: interval,
        value: groupedData[itemName] ? groupedData[itemName][interval] || 0 : 0,
      }));
      return {
        itemName,
        itemId,
        soldAfterApproval: totalItemQuantity[itemName] || 0,
        soldInLastMonth: itemData.last30Days,
        soldItemsByDate: groupedArray,
        lastPurchaseOrder: lastPurchaseOrderData.lastPurchaseOrder || {
          approvalDate: null,
          amount: 0,
          costPrice: 0,
        },
        lastSecondPurchaseOrder:
          lastPurchaseOrderData.lastSecondPurchaseOrder || {
            approvalDate: null,
            amount: 0,
            costPrice: 0,
          },
        lastThirdPurchaseOrder:
          lastPurchaseOrderData.lastThirdPurchaseOrder || {
            approvalDate: null,
            amount: 0,
            costPrice: 0,
          },
      };
    });

    res.status(200).json({
      message: messages.GET_ITEM_SOLD_SUCCESSFULLY,
      data: responseData,
      status: true,
    });
  } catch (error) {
    res.status(500).json({
      message: messages.UNEXPECTED_ERROR,
      status: false,
      error: error.message,
    });
  }
};

module.exports = getItemSold;
