const PurchaseOrder = require('../db-models/purchase-order-model');
const { Bill } = require('../db-models/bill-model');
const {
  groupByTimePeriod,
} = require('../util/groupByTimePeriod');
const { convertDateToIST } = require('../util/convertDateToIST');
const { MESSAGES } = require('../constants/messages');
const {
  validateGetItemsSellDetails,
} = require('../util/validateGetItemsSellDetails');
const { chunkArray } = require('../util/chunkArray');
const fetchLastPurchaseOrders = require('../util/fetchLastPurchaseOrders');
const { generateIntervalDatesByTimePeriod } = require('../util/generateIntervalDatesByTimePeriod');

const getItemsSellDetailsByPurchaseOrderId = async (req, res) => {
  try {
    const { error } = validateGetItemsSellDetails.validate(
      { ...req.query, id: req.params.id },
      { abortEarly: false }
    );

    if (error) {
      return res.status(400).json({
        status: false,
        errors: error.details.map((detail) => detail.message),
      });
    }
    const id = req.params.id;
    const { startDate, endDate, timePeriod } = req.query;

    const purchaseOrder = await PurchaseOrder.findById(id).select(
      'purchasedItems approveTime'
    );

    if (!purchaseOrder) {
      return res.status(404).json({
        error: MESSAGES.PURCHASE_ORDER_NOT_FOUND,
      });
    }

    const approvedTime = purchaseOrder.approveTime;
    if (!approvedTime) {
      return res.status(400).json({
        error: MESSAGES.APPROVAL_TIME_MISSING,
      });
    }
    const start = convertDateToIST(startDate).toISOString();
    const end = convertDateToIST(endDate).toISOString();

    const itemMap = {};
    purchaseOrder.purchasedItems.forEach((item) => {
      itemMap[item.item_id.toString()] = item.inputName;
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

    const itemBills = await Bill.find({
      'items.itemDetail': { $in: itemIds },
      createdAt: { $gte: start, $lte: end },
    }).select('items.itemDetail items.itemQuantityInBill createdAt');

    const groupedData = {};
    itemBills.forEach((bill) => {
      bill.items.forEach((item) => {
        const itemId = item.itemDetail.toString();
        const itemName = itemMap[itemId];
        const billDate = new Date(bill.createdAt);
        const formattedBillDate = convertDateToIST(billDate);
        const groupKey = groupByTimePeriod(formattedBillDate, timePeriod);

        if (itemName && groupKey) {
          if (!groupedData[itemName]) {
            groupedData[itemName] = {};
          }
          groupedData[itemName][groupKey] =
            (groupedData[itemName][groupKey] || 0) + item.itemQuantityInBill;
        }
      });
    });

    const allIntervals = generateIntervalDatesByTimePeriod(
      start,
      end,
      timePeriod
    );

    const totalItemQuantity = {};

    billsAfterPOApproval.forEach((bill) => {
      bill.items.forEach((item) => {
        const itemId = item.itemDetail.toString();
        const itemName = itemMap[itemId];
        if (itemName) {
          totalItemQuantity[itemName] =
            (totalItemQuantity[itemName] || 0) + item.itemQuantityInBill;
        }
      });
    });
    const lastPurchaseOrdersMap = await Promise.all(
      chunkArray(itemIds, 10).map((chunk) => fetchLastPurchaseOrders(chunk))
    );

    const flattenedLastPurchaseOrders = lastPurchaseOrdersMap.flat();
    const responseData = itemIds.map((itemId) => {
      const itemName = itemMap[itemId];

      const ordersForItem = flattenedLastPurchaseOrders.filter(
        (order) => order.item_id === itemId
      );

      const lastPurchaseOrders = ordersForItem.flatMap((order) =>
        ['first', 'second', 'third'].map((seq, index) => ({
          orderSequence: `${['First', 'Second', 'Third'][index]}`,
          approvalDate: order[`${seq}PurchaseOrder`].approvalDate
          ? new Date(order[`${seq}PurchaseOrder`].approvalDate).toISOString().slice(0, 10)
          : null,
          amount: order[`${seq}PurchaseOrder`].amount,
          costPrice: order[`${seq}PurchaseOrder`].costPrice,
        }))
      );

      const groupedArray = allIntervals.map((interval) => ({
        date: interval,
        value: groupedData[itemName] ? groupedData[itemName][interval] || 0 : 0,
      }));
      const totalItemsSoldInInterval = groupedArray.reduce(
        (total, current) => total + current.value,
        0
      );

      return {
        itemName,
        itemId,
        soldAfterApproval: totalItemQuantity[itemName] || 0,
        totalItemsSoldInInterval,
        soldItemsByDate: groupedArray,
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
