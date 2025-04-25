const { Bill } = require('../db-models/bill-model');

const getAllBill = async (req, res, next) => {
  const { storeId } = req.query;
  try {
    const { page = 1, size = 100, startDate, endDate } = req.query;

    const limit = Number(size);
    const skip = (Number(page) - 1) * limit;

    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const allBill = await Bill.find(filter)
    .populate([
      {
        path: 'items',
        populate: {
          path: 'itemDetail',
          model: 'Item',
          select: '-itemCostPricePerUnit',
        },
      },
      {
        path: 'staffId',
        model: 'staff',
      },
    ])
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);
    const billCount = await Bill.countDocuments(filter);
    res.status(200).json({ message: { allBill, billCount } });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllBill;
