const { Bill } = require('../db-models/bill-model');

const userDetails = async (req, res,next) => {
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
      next(error)
    }
  };

  module.exports = userDetails;