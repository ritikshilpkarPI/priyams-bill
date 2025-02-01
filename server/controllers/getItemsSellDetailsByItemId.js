const PurchaseOrder = require('../db-models/purchase-order-model');
const { Bill } = require('../db-models/bill-model');
const { groupByTimePeriod } = require('../util/groupByTimePeriod');
const { convertDateToIST } = require('../util/convertDateToIST');
const { MESSAGES } = require('../constants/messages');
const {
  validateGetItemsSellDetails,
} = require('../util/validateGetItemsSellDetails');
const { chunkArray } = require('../util/chunkArray');
const fetchLastPurchaseOrders = require('../util/fetchLastPurchaseOrders');
const {
  generateIntervalDatesByTimePeriod,
} = require('../util/generateIntervalDatesByTimePeriod');

const getItemsSellDetailsByItemId = async (req, res) => {
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

    const itemId = req.params.id;
    const { startDate, endDate, timePeriod } = req.query;

    const start = convertDateToIST(startDate).toISOString();
    const end = convertDateToIST(endDate).toISOString();

    const purchaseOrders = await PurchaseOrder.find({
      'purchasedItems.item_id': itemId,
      isApproved: true,
    }).select('purchasedItems approveTime updatedAt createdAt');

    if (!purchaseOrders || purchaseOrders.length === 0) {
      return res.status(404).json({
        error: MESSAGES.PURCHASE_ORDER_NOT_FOUND,
      });
    }
   
    let itemDetails = null;
    purchaseOrders.find((purchaseOrder) => {
      const purchasedItem = purchaseOrder.purchasedItems.find((item) => item.item_id.toString() === itemId);
      if (purchasedItem) {
        itemDetails = purchasedItem;
      }
      return purchasedItem;
    });

  
    const latestPurchaseOrders = await PurchaseOrder.findOne({
      'purchasedItems.item_id': itemId,
      isApproved: true,
    })
      .sort({ $natural: -1 })
      .select(' approveTime updatedAt createdAt');
      
    const approvedTime =
      latestPurchaseOrders.approveTime ||
      latestPurchaseOrders.updatedAt ||
      latestPurchaseOrders.createdAt ;

   

    const itemMap = {
      [itemId]: {
        inputName: itemDetails.inputName || '',
        mrp: itemDetails.mrp || 0,
      },
    };

    const billsAfterPOApproval = await Bill.find({
      'items.itemDetail': itemId,
      createdAt: { $gt: approvedTime },
    }).select('items.itemDetail items.itemQuantityInBill createdAt');

    const itemBills = await Bill.find({
      'items.itemDetail': itemId,
      createdAt: { $gte: start, $lte: end },
    }).select('items.itemDetail items.itemQuantityInBill createdAt');

    const groupedData = {};
    itemBills.forEach((bill) => {
      bill.items.forEach((item) => {
        if (item.itemDetail.toString() === itemId) {
          const itemName = itemMap[itemId].inputName;
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
        if (item.itemDetail.toString() === itemId) {
          const itemName = itemMap[itemId].inputName;
          totalItemQuantity[itemName] =
            (totalItemQuantity[itemName] || 0) + item.itemQuantityInBill;
        }
      });
    });

    const lastPurchaseOrdersMap = await fetchLastPurchaseOrders([itemId], 0);



    const lastPurchaseOrders = lastPurchaseOrdersMap.flatMap((order) =>
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

    const groupedArray = allIntervals.map((interval) => ({
      date: interval,
      value: groupedData[itemMap[itemId].inputName]
        ? groupedData[itemMap[itemId].inputName][interval] || 0
        : 0,
    }));

    const totalItemsSoldInInterval = groupedArray.reduce(
      (total, current) => total + current.value,
      0
    );

    const responseData = {
      itemName: itemMap[itemId].inputName,
      itemId,
      itemMRP: itemMap[itemId].mrp,
      soldAfterApproval: totalItemQuantity[itemMap[itemId].inputName] || 0,
      totalItemsSoldInInterval,
      soldItemsByDate: groupedArray,
      lastPurchaseOrders,
    };

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

module.exports = getItemsSellDetailsByItemId;
