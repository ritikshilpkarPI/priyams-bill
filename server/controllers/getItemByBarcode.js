const { Item } = require('../db-models/item-model');

const getItemByBarcode = async (req, res, next) => {
  try {
    const { itemBarcode } = req.params;

    const items = await Item.findOne({itemBarcode});

    res.status(200).json({ message: items  });
  } catch (error) {
    next(error);
  }
};

module.exports = getItemByBarcode;
