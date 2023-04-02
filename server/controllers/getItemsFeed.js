const { Item } = require('../db-models/item-model');

const getItemsFeed = async (req, res,next) => {
    try {
      const { minStockOnly = false, isDeleted = false } = JSON.parse(
        req.query.filters
      );
      let items = await Item.find({}, null, { sort: { itemName: 1 } });
      items = items.filter((item) => item.permanentlyOutOfStock === false);
      if (isDeleted === false) {
        items = items.filter((item) => !item.isDeleted);
      }
      if (minStockOnly) {
        items = items.filter(
          (item) =>
            Number(item.minimumStockQuantity) >= Number(item.itemStockQuantity)
        );
      }
      const itemCount = items.length;
      res.status(200).json({ message: { items, itemCount } });
    } catch (error) {
      next(error)
    }
  };

  module.exports = getItemsFeed;