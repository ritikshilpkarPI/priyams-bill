const { Bill } = require('../db-models/bill-model');

const getAllBill = async (req, res,next) => {
    try {
      const allBill = await Bill.find()
        // .populate({
        //   path: "items",
        //   populate: {
        //     path: "itemDetail",
        //     model: "Item",
        //   },
        // })
        .sort({ createdAt: -1 })
        .limit(Number(req.query.size));
      const billCount = await Bill.countDocuments();
      res.status(200).json({ message: { allBill, billCount } });
    } catch (error) {
      next(error)
    }
  };

  module.exports = getAllBill;