const { Bill } = require('../db-models/bill-model');
const { DailyBill } = require('../db-models/dailybill-model');

const getDayWiseBills = async (req, res, next) => {
  try {
    const allDailyBills = await Bill.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalNumberOfBillsForToday: {
            $sum: 1,
          },
          totalBillAmount: {
            $sum: '$billAmountTotal',
          },
          totalMRPAmount: {
            $sum: '$billMRPTotal',
          },
          totalDiscountAmount: {
            $sum: '$billDiscountTotal',
          },
          totalItemBilled: {
            $sum: '$totalNumberOfUniqueItems',
          },
          totalQuantityBilled: {
            $sum: '$totalNumberOfItems',
          },
          totalDailyProfit: {
            $sum: '$totalBillProfit',
          },
          totalCashPay: {
            $sum: '$cashPay',
          },
          totalUpiPay: {
            $sum: '$upiPay',
          },
          totalAmountReturn: {
            $sum: '$amountReturn',
          },
          dayBills: {
            $push: '$$ROOT',
          },
        },
      },
    ])
      .sort({ _id: -1 })
      .limit(5);
    res.status(200).json({ message: { allDailyBills } });
  } catch (error) {
    next(error);
  }
};

module.exports = getDayWiseBills;
