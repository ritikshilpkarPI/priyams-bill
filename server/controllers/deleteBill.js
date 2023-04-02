const { Bill } = require('../db-models/bill-model');

const deleteBill = async (req, res,next) => {
    try {
      const id = req.body.id;
      const bill = await Bill.findByIdAndRemove(id);
      res.status(200).json({ message: bill });
    } catch (error) {
      next(error)
    }
  };

  module.exports = deleteBill;