const {  inventoryItemCategory } = require('../db-models/item-model');

const getItemsCategoryList = async (req, res,next) => {
    try {
      return res.status(200).json({ message: { inventoryItemCategory } });
    } catch (error) {
      next(error)
    }
  };

  module.exports = getItemsCategoryList;