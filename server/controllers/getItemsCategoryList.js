const {  inventoryItemCategory } = require('../db-models/item-model');

const getItemsCategoryList = async (req, res) => {
    try {
      return res.status(200).json({ message: { inventoryItemCategory } });
    } catch (error) {
      res.status(400).send({ message: error, success: false });
    }
  };

  module.exports = {
    getItemsCategoryList,
  };