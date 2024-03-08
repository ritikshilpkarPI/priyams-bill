const { Item } = require('../db-models/item-model');

const getItemsLean = async (req, res, next) => {
  try {
    const itemsBarCodeMap = {};
    const itemNamesList = [];
    const itemBarCodesList = [];
    const itemsNameMap = {};
    const allItemsList = await Item.find(
      {
        permanentlyOutOfStock: false,
        isDeleted: false,
      },
      null,
      { sort: { itemName: 1 } }
    ).select({
      itemBarcode: 1,
      itemName: 1,
      itemMRPperUnit: 1,
      itemCostPricePerUnit: 1,
      itemSellingPricePerUnit: 1,
      slabPricing: 1,
    });

    allItemsList.forEach((item) => {
      itemNamesList.push(item.itemName);
      itemsNameMap[item.itemName] = item;
      if (item.itemBarcode) {
        itemBarCodesList.push(item.itemBarcode);
        if (itemsBarCodeMap[item.itemBarcode]) {
          itemsBarCodeMap[item.itemBarcode].push(item);
        } else {
          itemsBarCodeMap[item.itemBarcode] = [item];
        }
      }
    });

    const totalItemsCount = allItemsList.length;
    res.status(200).json({
      message: {
        itemsNameMap,
        itemsBarCodeMap,
        itemBarCodesList,
        itemNamesList,
        totalItemsCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getItemsLean;
