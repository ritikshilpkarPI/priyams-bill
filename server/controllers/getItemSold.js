const { isValidObjectId } = require('mongoose');
const PurchaseOrder = require('../db-models/purchase-order-model');
const { Bill } = require('../db-models/bill-model');

const getItemSold = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid ID format',
        success: false,
        error: 'Bad Request',
      });
    }

    const purchaseOrder = await PurchaseOrder.findById(id).select(
      'purchasedItems approveTime'
    );

    if (!purchaseOrder) {
      return res.status(404).json({
        message: 'Purchase order not found',
        success: false,
        error: 'Not Found',
      });
    }

    const approvedTime = purchaseOrder.approveTime;
    const itemMap = {};
    purchaseOrder.purchasedItems.forEach((item) => {
      itemMap[item.item_id.toString()] = item.inputName;
    });

    const now = new Date();
    const last30Days = new Date(now);
    last30Days.setDate(last30Days.getDate() - 30);

    const last3Months = new Date(now);
    last3Months.setMonth(last3Months.getMonth() - 3);

    const last1Year = new Date(now);
    last1Year.setFullYear(last1Year.getFullYear() - 1);

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
            console.error(
              `Error fetching purchase order for item ${itemId}:`,
              err
            );
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

    const billsLastYear = await Bill.find({
      'items.itemDetail': { $in: items },
      createdAt: { $gt: last1Year },
    }).select('items.itemDetail items.itemQuantityInBill createdAt');

    const monthlyData = {};
    for (let i = 0; i < 12; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyData[monthDate.toISOString().slice(0, 7)] = 0;
    }

    const itemQuantities = {};

    billsLastYear.forEach((bill) => {
      bill.items.forEach((item) => {
        const itemId = item.itemDetail.toString();
        const billDate = new Date(bill.createdAt);
        const monthKey = billDate.toISOString().slice(0, 7);

        if (items.includes(itemId)) {
          itemQuantities[itemId] = itemQuantities[itemId] || {
            total: 0,
            last30Days: 0,
            last3Months: 0,
            last1Year: 0,
            monthly: { ...monthlyData },
          };

          itemQuantities[itemId].total += item.itemQuantityInBill;

          if (billDate >= last30Days) {
            itemQuantities[itemId].last30Days += item.itemQuantityInBill;
          }
          if (billDate >= last3Months) {
            itemQuantities[itemId].last3Months += item.itemQuantityInBill;
          }
          if (billDate >= last1Year) {
            itemQuantities[itemId].last1Year += item.itemQuantityInBill;
          }
          if (itemQuantities[itemId].monthly[monthKey] !== undefined) {
            itemQuantities[itemId].monthly[monthKey] += item.itemQuantityInBill;
          }
        }
      });
    });

    const responseData = items.map((itemId) => {
      const itemName = itemMap[itemId];
      const itemData = itemQuantities[itemId] || {
        total: 0,
        last30Days: 0,
        last3Months: 0,
        last1Year: 0,
        monthly: { ...monthlyData },
      };

      const lastPurchaseOrderData = lastPurchaseOrders.find(
        (order) => order.item_id === itemId
      );

      return {
        itemName,
        itemId,
        soldAfterApproval: totalItemQuantity[itemName] || 0,
        soldInLastMonth: itemData.last30Days,
        soldInLastThreeMonths: Object.values(itemData.monthly).slice(0, 3),
        soldInLastYear: Object.values(itemData.monthly),
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
      message: 'Get sold items successfully',
      data:responseData,
      status: true,
    });
  } catch (error) {
    console.error('Error in getItemSold:', error);
    res.status(500).json({
      message: 'An unexpected error occurred',
      status: false,
      error: error.message,
    });
  }
};

module.exports = getItemSold;
