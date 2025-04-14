const { getStoreInventoryModel } = require('../db-models/storeInventory-model');
const { Item } = require('../db-models/item-model');
const { StoreModel } = require('../db-models/store-model');
const { MESSAGES } = require('../constants/messages');

const getItemsLean = async (req, res, next) => {
  const { pincode, storeCode } = req.query;

  let store;

  if (storeCode) {
    store = await StoreModel.findOne({ code: storeCode});
  } else if (pincode) {
    store = await StoreModel.findOne({ pincode });
  }
  
  
  try {

    if (!pincode) {
      return res.status(400).json({ error: MESSAGES.PINCODE_REQUIRED });
    }

    const store = await StoreModel.findOne({ pincode });
    if (!store) {
      return res.status(404).json({ error: MESSAGES.STORE_NOT_FOUND });
    }

    const StoreInventoryModel = getStoreInventoryModel(store.collectionName);

    const inventoryData = await StoreInventoryModel.find({});

    const itemIds = inventoryData.map((inv) => inv.itemId);

    const storeItemQtyMap = {};
    inventoryData.forEach((entry) => {
      if (entry.itemId && entry.itemQuantityInStore != null) {
        storeItemQtyMap[entry.itemId] = entry.itemQuantityInStore || 0;
      }
    });   
    const allItemsList = await Item.find(
      {
        _id: { $in: itemIds },
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
      itemShelfDates: 1,
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
        itemStockQuantity: itemQty,
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
