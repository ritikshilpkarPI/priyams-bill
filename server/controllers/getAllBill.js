const { Bill } = require('../db-models/bill-model');

const getAllBill = async (req, res) => {
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
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = getAllBill;