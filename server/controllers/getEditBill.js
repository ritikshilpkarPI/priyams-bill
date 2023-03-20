const { Bill } = require('../db-models/bill-model');

const getEditBill = async (req, res) => {
    try {
      const id = req.params.id;
      const bill = await Bill.findById(id).populate({
        path: 'items',
        populate: {
          path: 'itemDetail',
          model: 'Item',
        },
      });
  
      res.status(200).json({ message: bill });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = getEditBill;