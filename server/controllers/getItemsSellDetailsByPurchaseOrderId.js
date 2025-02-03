const PurchaseOrder = require('../db-models/purchase-order-model');
const { Bill } = require('../db-models/bill-model');
const { groupByTimePeriod } = require('../util/groupByTimePeriod');
const { convertDateToIST } = require('../util/convertDateToIST');
const { MESSAGES } = require('../constants/messages');
const { validateGetItemsSellDetails } = require('../util/validateGetItemsSellDetails');
const { chunkArray } = require('../util/chunkArray');
const fetchLastPurchaseOrders = require('../util/fetchLastPurchaseOrders');
const { generateIntervalDatesByTimePeriod } = require('../util/generateIntervalDatesByTimePeriod');

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

    const purchaseOrder = await PurchaseOrder.findById(id).select('purchasedItems approveTime');
    if (!purchaseOrder) {
      return res.status(404).json({ error: MESSAGES.PURCHASE_ORDER_NOT_FOUND });
    }

    const approvedTime = purchaseOrder.approveTime;
    const itemObj = {};
    const itemIds = [];

    purchaseOrder.purchasedItems.forEach((item) => {
      if (item.item_id && /^[a-fA-F0-9]{24}$/.test(item.item_id.toString())) {
        const itemIdStr = item.item_id.toString();
        itemObj[itemIdStr] = { inputName: item.inputName || '', mrp: item.mrp || 0 };
        itemIds.push(itemIdStr);
      }
    });

    if (!itemIds.length) {
      return res.status(200).json({
        message: MESSAGES.NO_ITEMS_FOUND,
        success: true,
        data: [],
      });
    }

    const billsQuery = Bill.find({
      'items.itemDetail': { $in: itemIds },
      createdAt: { $gt: approvedTime },
    }).select('items.itemDetail items.itemQuantityInBill createdAt');

    const intervalQueryChunks = chunkArray(intervals, 5).map((chunk) =>
      Promise.all(
        chunk.map(({ startDate, endDate, timePeriod }) => {
          const start = convertDateToIST(startDate).toISOString();
          const end = convertDateToIST(endDate).toISOString();
          return Bill.find({
            'items.itemDetail': { $in: itemIds },
            createdAt: { $gte: start, $lte: end },
          }).select('items.itemDetail items.itemQuantityInBill createdAt');
        })
      )
    );

    const [billsAfterPOApproval, ...intervalDataResultsChunks] = await Promise.all([
      billsQuery,
      ...intervalQueryChunks.flat(),
    ]);

    const intervalDataResults = intervalDataResultsChunks.flat();

    const totalItemQuantity = {};
    billsAfterPOApproval.forEach(({ items }) => {
      items.forEach(({ itemDetail, itemQuantityInBill }) => {
        const itemData = itemObj[itemDetail.toString()];
        if (itemData) {
          totalItemQuantity[itemData.inputName] =
            (totalItemQuantity[itemData.inputName] || 0) + itemQuantityInBill;
        }
      });
    });

    const intervalData = intervals.map(({ startDate, endDate, timePeriod }, index) => {
      const allIntervals = generateIntervalDatesByTimePeriod(
        convertDateToIST(startDate).toISOString(),
        convertDateToIST(endDate).toISOString(),
        timePeriod
      );

      if (!allIntervals.length) {
        return res.status(400).json({
          status: false,
          message: 'No intervals generated for the provided time period.',
        });
      }

      const groupedData = {};
      intervalDataResults[index].forEach(({ items, createdAt }) => {
        const billDate = convertDateToIST(createdAt);
        const groupKey = groupByTimePeriod(billDate, timePeriod);

        items.forEach(({ itemDetail, itemQuantityInBill }) => {
          const itemData = itemObj[itemDetail.toString()];
          if (itemData && groupKey) {
            groupedData[itemData.inputName] = groupedData[itemData.inputName] || {};
            groupedData[itemData.inputName][groupKey] =
              (groupedData[itemData.inputName][groupKey] || 0) + itemQuantityInBill;
          }
        });
      });

      return {
        startDate,
        endDate,
        timePeriod,
        data: allIntervals.map((interval) =>
          itemIds.map((itemId) => {
            const itemData = itemObj[itemId];
            if (!itemData) return null;
            return {
              itemName: itemData.inputName,
              date: interval,
              value:  groupedData[itemData.inputName] ? groupedData[itemData.inputName][interval] || 0 : 0,

            };
          }).filter(Boolean)
        ).flat(),
      };
    });

    const lastPurchaseOrders = (await Promise.all(chunkArray(itemIds, 10).map((chunk) => fetchLastPurchaseOrders(chunk, 3)))).flat();

    const responseData = itemIds.map((itemId) => {
      const itemData = itemObj[itemId];
      if (!itemData) return;
      return {
        itemName: itemData.inputName,
        itemId,
        itemMRP: itemData.mrp,
        soldAfterApproval: totalItemQuantity[itemData.inputName] || 0,
        intervals: intervalData.map((interval) => ({
          ...interval,
          data: interval.data
            .filter((item) => item.itemName === itemData.inputName)
            .map(({ date, value }) => ({ date, value })),
        })),
        
        lastPurchaseOrders: lastPurchaseOrders.filter((order) => order.item_id === itemId).flatMap((order, index) =>
          order.purchaseOrders.map(({ approvalDate, amount, costPrice, purchaseOrderId }) => ({
            orderSequence: `${index + 1}`,
            approvalDate: approvalDate ? new Date(approvalDate).toISOString().slice(0, 10) : null,
            amount,
            costPrice,
            purchaseOrderId,
          }))
        ),
      };
    }).filter(Boolean);

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