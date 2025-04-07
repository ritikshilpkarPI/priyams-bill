const { Bill } = require('../db-models/bill-model');

const getAllBill = async (req, res, next) => {
  try {
    const { storeId } = req.query;
    
    const allBill = await Bill.find({
      ...(storeId && { storeId }),
    })
      .populate({
        path: 'items',
        populate: {
          path: 'itemDetail',
          model: 'Item',
          select: '-itemCostPricePerUnit',
        },
      })
      .sort({ createdAt: -1 })
      .limit(Number(req.query.size));
    const billCount = await Bill.countDocuments();
    res.status(200).json({ message: { allBill, billCount } });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllBill;
