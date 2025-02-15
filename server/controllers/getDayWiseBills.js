const { Bill } = require('../db-models/bill-model');

const getDayWiseBills = async (req, res, next) => {
  try {
    // Calculate the start date for the last 5 days
    const today = new Date();
    const fiveDaysAgo = new Date(today);
    fiveDaysAgo.setDate(today.getDate() - 20);

    const allDailyBills = await Bill.aggregate(
      [
        {
          $match: {
            createdAt: {
              $gte: fiveDaysAgo, // Filter documents from the last 5 days
              $lte: today,       // Up to today
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            totalNumberOfBillsForToday: { $sum: 1 },
            totalBillAmount: { $sum: '$billAmountTotal' },
            totalMRPAmount: { $sum: '$billMRPTotal' },
            totalDiscountAmount: { $sum: '$billDiscountTotal' },
            totalItemBilled: { $sum: '$totalNumberOfUniqueItems' },
            totalQuantityBilled: { $sum: '$totalNumberOfItems' },
            totalDailyProfit: { $sum: '$totalBillProfit' },
            totalCashPay: { $sum: '$cashPay' },
            totalUpiPay: { $sum: '$upiPay' },
            totalAmountReturn: { $sum: '$amountReturn' },
            dayBills: { $push: '$$ROOT' },
          },
        },
        { $sort: { _id: -1 } },
      ],
      { allowDiskUse: true } // Enable disk usage
    );

    res.status(200).json({ message: { allDailyBills } });
  } catch (error) {
    next(error);
  }
};

module.exports = getDayWiseBills;
