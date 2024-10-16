const { Item } = require('../db-models/item-model');

const getItemsByFilter = async (req, res, next) => {
  try {
    const { itemBarcode, itemName, itemBrandName } = req.body;
    console.log({...req.body});

    const query = {};

    if (itemBarcode) {
      query.itemBarcode = itemBarcode;
    }

    if (itemName) {
      query.itemName = { $regex: itemName, $options: 'i' }; 
    }

    if (itemBrandName) {
      query.itemBrandName = { $regex: itemBrandName, $options: 'i' };
    }

    console.log({query});

    if(Object.keys(query).length <= 0){
      res.status(200).json({ message: [] });
      return;
    }

    const items = await Item.find(query);

    res.status(200).json({ message: items });
  } catch (error) {
    next(error);
  }
};

module.exports = getItemsByFilter;
