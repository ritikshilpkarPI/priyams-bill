const { Item } = require('../db-models/item-model');

const filterExpiryDates = async (req, res) => {
    const { startDate, endDate } = req.body;
    const splitDateInDbFormat = (date = 'dd/mm/yyyy') => {
      const [day, month, year] = date.split('/'); // = [01, 02, 2028]
      return new Date(Number(year), Number(month), Number(day));
    };
    try {
      const expiredItems = await Item.aggregate([
        { $project: { useByDate: 1, itemName: 1, itemBarcode: 1 } },
        { $unwind: '$useByDate' },
        {
          $match: {
            'useByDate.date': {
              $gte: splitDateInDbFormat(startDate),
              $lte: splitDateInDbFormat(endDate),
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
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = filterExpiryDates;