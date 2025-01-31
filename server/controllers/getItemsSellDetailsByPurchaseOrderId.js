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
    const { id } = req.params;

    const purchaseOrder = await PurchaseOrder.findById(id).select(
      'purchasedItems approveTime'
    );
    if (!purchaseOrder) {
      return res.status(404).json({ error: MESSAGES.PURCHASE_ORDER_NOT_FOUND });
    }

    const approvedTime = purchaseOrder.approveTime;
    const itemMap = new Map();

    purchaseOrder.purchasedItems.forEach((item) => {
      if (item.item_id && item.item_id !== 'undefined') {
        itemMap.set(item.item_id.toString(), {
          inputName: item.inputName || '',
          mrp: item.mrp || 0,
        });
      }
    });

    const itemIds = [...itemMap.keys()];
    if (!itemIds.length) {
      return res.status(200).json({
        message: MESSAGES.NO_ITEMS_FOUND,
        success: true,
        data: [],
      });
    }

    const [billsAfterPOApproval, intervalData] = await Promise.all([
      Bill.find({
        'items.itemDetail': { $in: itemIds },
        createdAt: { $gt: approvedTime },
      }).select('items.itemDetail items.itemQuantityInBill createdAt'),

      Promise.all(
        intervals.map(async ({ startDate, endDate, timePeriod }) => {
          const start = convertDateToIST(startDate).toISOString();
          const end = convertDateToIST(endDate).toISOString();

          const itemBills = await Bill.find({
            'items.itemDetail': { $in: itemIds },
            createdAt: { $gte: start, $lte: end },
          }).select('items.itemDetail items.itemQuantityInBill createdAt');

          const groupedData = {};
          itemBills.forEach(({ items, createdAt }) => {
            const billDate = convertDateToIST(createdAt);
            const groupKey = groupByTimePeriod(billDate, timePeriod);

            items.forEach(({ itemDetail, itemQuantityInBill }) => {
              const itemData = itemMap.get(itemDetail.toString());
              if (itemData && groupKey) {
                groupedData[itemData.inputName] =
                  groupedData[itemData.inputName] || {};
                groupedData[itemData.inputName][groupKey] =
                  (groupedData[itemData.inputName][groupKey] || 0) +
                  itemQuantityInBill;
              }
            });
          });

          const allIntervals = generateIntervalDatesByTimePeriod(
            start,
            end,
            timePeriod
          );

          if (!allIntervals.length) {
            return res.status(400).json({
              status: false,
              message: 'No intervals generated for the provided time period.',
            });
          }

          allIntervals.forEach((intervalDate) => {
            for (const itemName of Object.keys(groupedData)) {
              groupedData[itemName][intervalDate] =
                groupedData[itemName][intervalDate] || 0;
            }
          });

          const soldItemsByDate = allIntervals.flatMap((interval) =>
            itemIds.map((itemId) => {
              const itemData = itemMap.get(itemId);
              if (!itemData) return null; 
              const { inputName } = itemData;
              return {
                itemName: inputName,
                date: interval,
                value: groupedData[inputName] ? groupedData[inputName][interval] || 0 : 0, 
              };
            })
          );
          

          const totalItemsSoldInInterval = allIntervals.reduce(
            (total, interval) =>
              total +
              Object.keys(groupedData).reduce(
                (innerTotal, itemName) =>
                  innerTotal + ((groupedData[itemName] && groupedData[itemName][interval]) ||  0),
                0
              ),
            0
          );

          return { startDate, endDate, timePeriod, data: soldItemsByDate, totalItemsSoldInInterval };
        })
      ),
    ]);

    const totalItemQuantity = {};
    billsAfterPOApproval.forEach(({ items }) =>
      items.forEach(({ itemDetail, itemQuantityInBill }) => {
        const itemData = itemMap.get(itemDetail.toString());
        if (itemData) {
          totalItemQuantity[itemData.inputName] =
            (totalItemQuantity[itemData.inputName] || 0) + itemQuantityInBill;
        }
      })
    );

    const lastPurchaseOrdersMap = await Promise.all(
      chunkArray(itemIds, 10).map((chunk) => fetchLastPurchaseOrders(chunk, 3))
    );
    const flattenedLastPurchaseOrders = lastPurchaseOrdersMap.flat();

    const responseData = itemIds.map((itemId) => {
      const itemData = itemMap.get(itemId);
      if (!itemData) return;

      const { inputName: itemName, mrp: itemMRP } = itemData;
      const ordersForItem = flattenedLastPurchaseOrders.filter(
        (order) => order.item_id === itemId
      );
    
      const lastPurchaseOrders = ordersForItem.flatMap((order) =>
        order.purchaseOrders.map(({ approvalDate, amount, costPrice, purchaseOrderId }, index) => ({
          orderSequence: `${index + 1}`,
          approvalDate: approvalDate ? new Date(approvalDate).toISOString().slice(0, 10) : null,
          amount,
          costPrice,
          purchaseOrderId,
        }))
      );

      const filterIntervalDataByItemName = (intervalData, itemName) =>
        intervalData.map((interval) => ({
          ...interval,
          data: interval.data
            .filter((item) => item.itemName === itemName)
            .map(({ itemName, ...rest }) => rest),
        }));

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