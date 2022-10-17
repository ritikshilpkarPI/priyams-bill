const { Bill } = require("../db-models/bill-model");

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
          $sum: "$billAmountTotal",
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
          $sum: "$totalBillProfit",
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
          $sum: "$billDiscountTotal",
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
          $sum: "$billMRPTotal",
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
      $unwind: "$items",
    },
  ]);
  const populatedBills = await Bill.populate(unwindedItemBills, {
    path: "items",
    populate: {
      path: "itemDetail",
      model: "Item",
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
      $unwind: "$items",
    },
    {
      $group: {
        _id: "$items.itemDetail",
        createdAtDates: { $push: "$createdAt" },
        items: { $push: "$items" },
        totalDiscountSum: {
          $sum: "$items.itemDiscountTotal",
        },
        totalAmountSum: {
          $sum: "$items.itemSellingPriceTotal",
        },
        totalMRPsum: {
          $sum: "$items.itemMRPtotal",
        },
        totalQuantitysum: {
          $sum: "$items.itemQuantityInBill",
        },
      },
    },
  ]);
  const allItemsBillingTrend = await Bill.populate(unwindedItemDetails, {
    path: "items",
    populate: {
      path: "itemDetail",
      model: "Item",
    },
  });
  return allItemsBillingTrend;
};

const filterFunctionsObj = {
  totalAmount: getTotalAmountReport,
  totalProfit: getTotalProfitReport,
  totalDiscount: getTotalDiscountReport,
  totalMRP: getTotalMRPReport,
  itemBillingTrend: getItemTrendReport,
  allItemsBillingTrend: getAllItemsTrendReport,
};

const getDateRangeReport = async (req, res) => {
  const filterType = req.params.filterName;
  const { startDate, lastDate, startTime, lastTime, itemName } = req.body;

  try {
    const report = await filterFunctionsObj[filterType](
      startDate,
      lastDate,
      itemName
    );
    res.status(200).json({ report, startDate, lastDate, filterType });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDateRangeReport,
};
