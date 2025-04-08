const { getStoreInventoryModel } = require('../db-models/storeInventory-model');
const { Item } = require('../db-models/item-model');
const { StoreModel } = require('../db-models/store-model');

const getItemsLean = async (req, res, next) => {
  const { storeId } = req.query;

  const store = await StoreModel.findOne({code: storeId});
  
  try {
    const collectionName = store?.collectionName;


    const storeCollection = getStoreInventoryModel(collectionName);


    const storeItems = await storeCollection.find({}); 


    const storeItemQtyMap = {};
    storeItems.forEach((entry) => {
      if (entry.itemId && entry.itemQuantityInStore != null) {
        storeItemQtyMap[entry.itemId] = entry.itemQuantityInStore || 0;
      }
    });   
    const allItemsList = await Item.find(
      {
        permanentlyOutOfStock: false,
        isDeleted: false,
        temporaryDeleted: { $exists: false },
      },
      null,
      { sort: { itemName: 1 } }
    ).select({
      itemBarcode: 1,
      itemName: 1,
      itemMRPperUnit: 1,
      itemSellingPricePerUnit: 1,
      slabPricing: 1,
      itemStockQuantity: 1,
      itemPerUnitQuantity: 1,
      quantityUnitName: 1,
    });

   
    const itemsBarCodeMap = {};
    const itemNamesList = [];
    const itemBarCodesList = [];
    const itemsNameMap = {};

    allItemsList.forEach((item) => {
  
      const itemQty = storeItemQtyMap[item._id] || 0;

      const itemWithQty = {
        ...item.toObject(),
        itemQtyInStore: itemQty,
      };

      itemNamesList.push(item.itemName);
      itemsNameMap[item.itemName] = itemWithQty;

      if (item.itemBarcode) {
        itemBarCodesList.push(item.itemBarcode);
        if (!itemsBarCodeMap[item.itemBarcode]) {
          itemsBarCodeMap[item.itemBarcode] = [];
        }
        itemsBarCodeMap[item.itemBarcode].push(itemWithQty);
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
