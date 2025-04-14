const { normalizeDate } = require('../util/normalizeDate');
const { Item } = require('../db-models/item-model');

const filterExpiryDates = async (req, res, next) => {
    let { startDate, endDate } = req.body;
    // Normalize input dates
    startDate = normalizeDate(startDate);
    endDate = normalizeDate(endDate);

    if (!startDate || !endDate) {
        throw Error("Invalid or missing date format. Expected a valid date.");
    }
    try {
      const expiredItems = await Item.aggregate([
        {
            $unwind:  "$itemShelfDates"
        },
        {
          $match: {
              "itemShelfDates.expiryDate": { 
                  $gte: new Date(startDate)  , 
                  $lte: new Date(endDate)
              }
          }
        },
        
        {
            $project: {
                itemName: 1,
                itemBarcode: 1,
                itemMRPperUnit: 1,
                itemCostPricePerUnit: 1,
                itemSellingPricePerUnit: 1,
                expiryDate: "$itemShelfDates.expiryDate",
                mfgDate: "$itemShelfDates.manufacturingDate",
                expiryQuantity: "$itemShelfDates.quantity"
            }
        },
        
        { $sort: { expiryDate: -1 } } 
    ]);
    
      return res.status(200).json({ message: { expiredItems } });
    } catch (error) {
      next(error)
    }
  };

  module.exports = filterExpiryDates;