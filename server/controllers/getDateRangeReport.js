const { Bill } = require('../db-models/bill-model');
const PurchaseOrder = require('../db-models/purchase-order-model');



const getTotalAmountReport = async (startDate, lastDate) => {
  const totalAmountReport = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(lastDate) },
      },
    },
    {
      $group: {
        _id: null,
        totalAmountSum: {
          $sum: '$billAmountTotal',
        },
      },
    },
  ]);
  return totalAmountReport;
};

const getTotalProfitReport = async (startDate, lastDate) => {
  const totalProfitReport = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(lastDate) },
      },
    },
    {
      $group: {
        _id: null,
        totalProfitSum: {
          $sum: '$totalBillProfit',
        },
      },
    },
  ]);
  return totalProfitReport;
};

const getTotalDiscountReport = async (startDate, lastDate) => {
  const totalDiscountReport = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(lastDate) },
      },
    },
    {
      $group: {
        _id: null,
        totalDiscountSum: {
          $sum: '$billDiscountTotal',
        },
      },
    },
  ]);
  return totalDiscountReport;
};

const getTotalMRPReport = async (startDate, lastDate) => {
  const totalMRPReport = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(lastDate) },
      },
    },
    {
      $group: {
        _id: null,
        totalMRPSum: {
          $sum: '$billMRPTotal',
        },
      },
    },
  ]);
  return totalMRPReport;
};

const getItemTrendReport = async (startDate, lastDate, itemName) => {
  const unwindedItemBills = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(lastDate) },
      },
    },
    {
      $unwind: '$items',
    },
  ]);
  const populatedBills = await Bill.populate(unwindedItemBills, {
    path: 'items',
    populate: {
      path: 'itemDetail',
      model: 'Item',
      match: { itemName: { $eq: itemName } },
    },
  });
  const itemTrendReport = populatedBills.filter(
    (bill) => bill.items.itemDetail
  );
  return itemTrendReport;
};

const getAllItemsTrendReport = async (startDate, lastDate) => {
  const unwindedItemDetails = await Bill.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(lastDate) },
      },
    },
    {
      $unwind: '$items',
    },
    {
      $group: {
        _id: '$items.itemDetail',
        createdAtDates: { $push: '$createdAt' },
        items: { $push: '$items' },
        totalDiscountSum: {
          $sum: '$items.itemDiscountTotal',
        },
        totalAmountSum: {
          $sum: '$items.itemSellingPriceTotal',
        },
        totalMRPsum: {
          $sum: '$items.itemMRPtotal',
        },
        totalQuantitysum: {
          $sum: '$items.itemQuantityInBill',
        },
        itemBarcode: { $first: '$items.itemBarcode' }
      },
    },
  ]);
  const allItemsBillingTrend = await Bill.populate(unwindedItemDetails, {
    path: 'items',
    populate: {
      path: 'itemDetail',
      model: 'Item',
    },
  });
  return allItemsBillingTrend;
};

const getPurchasedItemsReport = async (startDate, lastDate) => {
  return await PurchaseOrder.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(lastDate) },
        isApproved: true,
        isRejected: false,
      },
    },
    { $unwind: '$purchasedItems' },
    {
      $unwind: {
        path: '$purchasedItems.expiryDates',
        preserveNullAndEmptyArrays: true, 
      },
    },
    {
      $group: {
        _id: '$purchasedItems.barcode',
        itemName: { $first: '$purchasedItems.inputName' },
        totalStock: { $sum: '$purchasedItems.stockQuantity' },
        itemQuantity: { $sum: '$purchasedItems.itemQuantity' },
        unit: { $first: '$purchasedItems.unit' },
        mrp: { $first: '$purchasedItems.mrp' },
        costPrice: { $first: '$purchasedItems.costPrice' },
        purchaseDates: { $addToSet: '$createdAt' },
        suppliers: { $addToSet: '$procurementSource' },
        purchaseOrderIds: { $addToSet: '$_id' },
        expiryDates: { $addToSet: '$purchasedItems.expiryDates' },
      },
    },
    {
      $project: {
        _id: 0,
        barcode: '$_id',
        itemName: 1,
        totalStock: 1,
        mrp: 1,
        costPrice: 1,
        lastPurchaseDate: { $max: '$purchaseDates' },
        firstPurchaseDate: { $min: '$purchaseDates' },
        totalOrders: { $size: '$purchaseOrderIds' },
        suppliers: { $setUnion: ['$suppliers'] }, // Get unique suppliers
        itemQuantity: 1,
        unit: 1,
        expiryDates: 1,
      }
    }
  ]);
};

const filterFunctionsObj = {
  totalAmount: getTotalAmountReport,
  totalProfit: getTotalProfitReport,
  totalDiscount: getTotalDiscountReport,
  totalMRP: getTotalMRPReport,
  itemBillingTrend: getItemTrendReport,
  allItemsBillingTrend: getAllItemsTrendReport,
  purchasedItems: getPurchasedItemsReport,
};

const getDateRangeReport = async (req, res,next) => {
  const filterType = req.params.filterName;
  const { startDate, lastDate, itemName } = req.body;

  try {
    const report = await filterFunctionsObj[filterType](
      startDate,
      lastDate,
      itemName
    );
    res.status(200).json({ report, startDate, lastDate, filterType });
  } catch (error) {
    next(error)
  }
};

module.exports = getDateRangeReport;
