const { getStoreInventoryModel } = require('../db-models/storeInventory-model');
const { Item } = require('../db-models/item-model');
const { StoreModel } = require('../db-models/store-model');
const { default: mongoose } = require('mongoose');

const getItemsLean = async (req, res, next) => {
  const { pincode, storeCode, storeId } = req.query;

  try {
    let store;
    let inventoryData = [];
    let itemIds = [];
    let storeItemQtyMap = {};

    if (storeId && mongoose.isValidObjectId(storeId)) {
      store = await StoreModel.findById(storeId).lean();
    } else if (storeCode) {
      store = await StoreModel.findOne({ code: storeCode }).lean();
    } else if (pincode) {
      store = await StoreModel.findOne({ pincode }).lean();
    }

    if (store) {
      const StoreInventoryModel = getStoreInventoryModel(store.collectionName);
      inventoryData = await StoreInventoryModel.find({}).lean();
      itemIds = inventoryData.map((inv) => inv.itemId);

      inventoryData.forEach((entry) => {
        if (entry.itemId && entry.itemQuantityInStore != null) {
          storeItemQtyMap[entry.itemId] = entry.itemQuantityInStore || 0;
        }
      });
    }

    const itemFilter = {
      permanentlyOutOfStock: false,
      isDeleted: false,
      temporaryDeleted: { $exists: false },
    };

    if (store) {
      itemFilter._id = { $in: itemIds };
    }

    const allItemsList = await Item.find(itemFilter, null, {
      sort: { itemName: 1 },
    }).select({
      itemBarcode: 1,
      itemName: 1,
      itemMRPperUnit: 1,
      itemSellingPricePerUnit: 1,
      slabPricing: 1,
      itemStockQuantity: 1,
      itemPerUnitQuantity: 1,
      quantityUnitName: 1,
      itemShelfDates: 1,
      sku: 1,
    }).lean();

    const itemsBarCodeMap = {};
    const itemsNameMap = {};

    allItemsList.forEach((item) => {
      const itemQty = storeItemQtyMap[item._id] || item.itemStockQuantity || 0;
      const inventoryEntry = inventoryData.find((inv) => inv.itemId.toString() === item._id.toString());
      let itemWithQty
      if(store){
        itemWithQty = {
          ...item,
          itemQtyInStore: itemQty,
          itemStockQuantity: itemQty,
          itemShelfDates: inventoryEntry?.itemShelfDates || []
        };
      }else{
        itemWithQty = {
          ...item,
          itemQtyInStore: itemQty,
          itemStockQuantity: itemQty,
        };
      }

      itemsNameMap[item.itemName] = itemWithQty;

      if (item.itemBarcode) {
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
        totalItemsCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getItemsLean;