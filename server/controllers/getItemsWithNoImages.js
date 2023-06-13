const { Item } = require('../db-models/item-model');

const getItemsWithNoImages = async (req, res, next) => {
  try {
    const items = await Item.find({ images: {
        $in: [[], null]
    } }, { itemName: true });
    res.status(200).json({ items, message: 'successfully got the items' });
  } catch (error) {
    next(error);
  }
};
module.exports = getItemsWithNoImages;
