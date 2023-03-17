const { Bill } = require('../db-models/bill-model');

const userDetails = async (req, res) => {
    try {
      const userDetails = await Bill.aggregate([
        {
          $match: {
            customerPhone: {
              $ne: null,
            },
          },
        },
        {
          $group: {
            _id: '$customerPhone',
            customerName: { $first: '$customerName' },
          },
        },
      ]);
      res.status(200).json({ message: userDetails });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = {
    userDetails,
  };