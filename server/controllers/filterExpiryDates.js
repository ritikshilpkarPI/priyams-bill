const { normalizeDate } = require('../util/normalizeDate');
const { Item } = require('../db-models/item-model');

const filterExpiryDates = async (req, res,next) => {
      // Ensure consistent parsing of ISO date strings
    let { startDate, endDate } = req.body;

    // Normalize the dates
    startDate = normalizeDate(startDate);
    endDate = normalizeDate(endDate);
  
    if (!startDate || !endDate) {
        throw Error("Invalid or missing date format. Expected a valid date.");
    }
    try {
      const expiredItems = await Item.aggregate([
        { $project: { useByDate: 1, itemName: 1, itemBarcode: 1 } },
        { $unwind: '$useByDate' },
        {
          $match: {
            'useByDate.date': {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $sort: {
            'useByDate.date': 1,
          },
        },
      ]);
      return res.status(200).json({ message: { expiredItems } });
    } catch (error) {
      next(error)
    }
  };

  module.exports = filterExpiryDates;