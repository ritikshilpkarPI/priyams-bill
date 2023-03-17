const { Bill } = require('../db-models/bill-model');

const deleteBill = async (req, res) => {
    try {
      const id = req.body.id;
      const bill = await Bill.findByIdAndRemove(id);
      res.status(200).json({ message: bill });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = {
    deleteBill,
  };