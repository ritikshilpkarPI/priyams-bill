const { Item } = require('../db-models/item-model');

const getItemsWithSelection = async (req, res,next) => {
    try {
      const { 
        minStockOnly = false, isDeleted = false 
      } = req.query?.filters || {};

      const query = {
        permanentlyOutOfStock: false,
        isDeleted
      }
      if (minStockOnly) {
        query.$expr = { $lte: ['$itemStockQuantity', '$minimumStockQuantity'] }
      }
      
      let items = await Item.find(query)
        .select('_id itemBarcode itemName itemMRPperUnit')
        .sort({ itemName: 1 });
      
      const itemCount = items.length;
      const payloadSize = Buffer.byteLength(JSON.stringify(items), 'utf8');
      res.status(200).json({ message: { itemCount, payloadSize, items } });
    } catch (error) {
      next(error)
    }
  };

  module.exports = getItemsWithSelection;