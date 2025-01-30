const PurchaseOrder = require('../db-models/purchase-order-model');
const { Bill } = require('../db-models/bill-model');
const { groupByTimePeriod } = require('../util/groupByTimePeriod');
const { convertDateToIST } = require('../util/convertDateToIST');
const { MESSAGES } = require('../constants/messages');
const {validateGetItemsSellDetails} = require('../util/validateGetItemsSellDetails');
const { chunkArray } = require('../util/chunkArray');
const fetchLastPurchaseOrders = require('../util/fetchLastPurchaseOrders');
const {generateIntervalDatesByTimePeriod} = require('../util/generateIntervalDatesByTimePeriod');
const getItemsSellDetailsByPurchaseOrderId = async (req, res) => {
  try {
    const { error } = validateGetItemsSellDetails.validate(
      { ...req.body, id: req.params.id },
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        status: false,
        errors: error.details.map((detail) => detail.message),
      });
    }
    const { intervals } = req.body; 
    const {id}=req.params

    const purchaseOrder = await PurchaseOrder.findById(id).select(
      'purchasedItems approveTime'
    );
    if (!purchaseOrder) {
      return res.status(404).json({
        error: MESSAGES.PURCHASE_ORDER_NOT_FOUND,
      });
    }

    const approvedTime = purchaseOrder.approveTime;
    const itemMap = {};
    purchaseOrder.purchasedItems.forEach((item) => {
      if (item && item.item_id && item.item_id !== 'undefined') {
        const itemId = item.item_id.toString();
        itemMap[itemId] = {
          inputName: item.inputName || '',
          mrp: item.mrp || 0,
        };
      }
    });

    const itemIds = Object.keys(itemMap);

    if (itemIds.length === 0) {
      return res.status(200).json({
        message: MESSAGES.NO_ITEMS_FOUND,
        success: true,
        data: [],
      });
    }

    const billsAfterPOApproval = await Bill.find({
      'items.itemDetail': { $in: itemIds },
      createdAt: { $gt: approvedTime },
    }).select('items.itemDetail items.itemQuantityInBill createdAt');

    const groupedData = {};
    let allIntervals;
    const intervalData = await Promise.all(
      intervals.map(async (interval) => {
        const { startDate, endDate, timePeriod } = interval;
        const start = convertDateToIST(startDate).toISOString();
        const end = convertDateToIST(endDate).toISOString();

        const itemBills = await Bill.find({
          'items.itemDetail': { $in: itemIds },
          createdAt: { $gte: start, $lte: end },
        }).select('items.itemDetail items.itemQuantityInBill createdAt');

        itemBills.forEach((bill) => {
          bill.items.forEach((item) => {
            const itemId = item.itemDetail.toString();
            const itemData = itemMap[itemId];

            if (!itemData) {
              return;
            }

            const itemName = itemData.inputName;
            const billDate = new Date(bill.createdAt);
            const formattedBillDate = convertDateToIST(billDate);
            const groupKey = groupByTimePeriod(formattedBillDate, timePeriod);
            if (itemName && groupKey) {
              if (!groupedData[itemName]) {
                groupedData[itemName] = {};
              }
              groupedData[itemName][groupKey] =
                (groupedData[itemName][groupKey] || 0) +
                item.itemQuantityInBill;
            }
          });
        });

        allIntervals = generateIntervalDatesByTimePeriod(
          start,
          end,
          timePeriod
        );
        if (!allIntervals || allIntervals.length === 0) {
          return res.status(400).json({
            status: false,
            message: 'No intervals generated for the provided time period.',
          });
        }

        allIntervals.forEach((intervalDate) => {
          Object.keys(groupedData).forEach((itemName) => {
            groupedData[itemName][intervalDate] =
              groupedData[itemName][intervalDate] || 0;
          });
        });

        const soldItemsByDate = allIntervals
          .map((interval) => {
            const itemNames = itemIds.map(
              (itemId) => itemMap[itemId].inputName
            );
            return itemNames.map((itemName) => ({
              itemName,
              date: interval,
              value: groupedData[itemName]
                ? groupedData[itemName][interval] || 0
                : 0, 
            }));
          })
          .flat();
        const totalItemsSoldInInterval = allIntervals.reduce(
          (total, interval) => {
            return (
              total + Object.keys(groupedData).reduce((innerTotal, itemName) => {
                return (innerTotal + ((groupedData[itemName] && groupedData[itemName][interval]) ||  0)
                );
              }, 0)
            );
          },
          0
        );
        return {
          startDate,
          endDate,
          timePeriod,
          data: soldItemsByDate,
          totalItemsSoldInInterval,
        };
      })
    );

    const totalItemQuantity = {};

    billsAfterPOApproval.forEach((bill) => {
      bill.items.forEach((item) => {
        const itemId = item.itemDetail.toString();
        const itemData = itemMap[itemId];
        if (!itemData) {
          return;
        }
        const itemName = itemData.inputName;
        if (itemName) {
          totalItemQuantity[itemName] =
            (totalItemQuantity[itemName] || 0) + item.itemQuantityInBill;
        }
      });
    });
    const lastPurchaseOrdersMap = await Promise.all(
      chunkArray(itemIds, 10).map((chunk) =>
        fetchLastPurchaseOrders(chunk, (limit = 3))
      )
    );

    const flattenedLastPurchaseOrders = lastPurchaseOrdersMap.flat();

    const responseData = itemIds.map((itemId) => {
      const itemData = itemMap[itemId];
      if (!itemData) {
        return;
      }

      const itemName = itemData.inputName;
      const itemMRP = itemData.mrp;

      const ordersForItem = flattenedLastPurchaseOrders.filter(
        (order) => order.item_id === itemId
      );
      const lastPurchaseOrders = ordersForItem.flatMap((order) =>
        order.purchaseOrders.map((orderDetails, index) => ({
          orderSequence: `${index + 1}`,
          approvalDate: orderDetails.approvalDate
            ? new Date(orderDetails.approvalDate).toISOString().slice(0, 10)
            : null,
          amount: orderDetails.amount,
          costPrice: orderDetails.costPrice,
          purchaseOrderId: orderDetails.purchaseOrderId,
        }))
      );

      const filterIntervalDataByItemName = (intervalData, itemName) => {
        return intervalData.map((interval) => {
          const filteredData = interval.data.filter(
            (item) => item.itemName === itemName
          );
          const cleanedData = filteredData.map(({ itemName, ...rest }) => rest);
          return {
            ...interval,
            data: cleanedData,
          };
        });
      };

      return {
        itemName,
        itemId,
        itemMRP,
        soldAfterApproval: totalItemQuantity[itemName] || 0,
        intervals: filterIntervalDataByItemName(intervalData, itemName),
        lastPurchaseOrders,
      };
    });

    res.status(200).json({
      message: MESSAGES.GET_ITEM_SOLD_SUCCESSFULLY,
      data: responseData,
      status: true,
    });
  } catch (error) {
    res.status(400).json({
      message: MESSAGES.UNEXPECTED_ERROR,
      status: false,
      error: error.message,
    });
  }
};

module.exports = getItemsSellDetailsByPurchaseOrderId;