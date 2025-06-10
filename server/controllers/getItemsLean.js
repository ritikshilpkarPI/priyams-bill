const { getStoreInventoryModel } = require('../db-models/storeInventory-model');
const { Item } = require('../db-models/item-model');
const { StoreModel } = require('../db-models/store-model');
const { default: mongoose } = require('mongoose');

const getItemsLean = async (req, res, next) => {
  const { pincode, storeCode, storeId } = req.query;

  try {
    let store;
    let aggregatedItems = [];
    let itemsNameMap = {};
    let itemsBarCodeMap = {};
    let totalItemsCount = 0;

    if (storeId && mongoose.isValidObjectId(storeId)) {
      store = await StoreModel.findById(storeId).lean();
    } else if (storeCode) {
      store = await StoreModel.findOne({ code: storeCode }).lean();
    } else if (pincode) {
      store = await StoreModel.findOne({ pincode }).lean();
    }

    if (store) {
      const inventoryColl = mongoose.connection.collection(store.collectionName);
      const pipeline = [
        {
          $lookup: {
            from: Item.collection.name,
            localField: "itemId",
            foreignField: "_id",
            as: "itemDoc"
          }
        },
        { $unwind: "$itemDoc" },
        {
          $match: {
            "itemDoc.permanentlyOutOfStock": false,
            "itemDoc.isDeleted": false,
            "itemDoc.temporaryDeleted": { $exists: false }
          }
        },
        { $sort: { "itemDoc.itemName": 1 } },
        {
          $project: {
            _id: "$itemDoc._id",
            itemBarcode: "$itemDoc.itemBarcode",
            itemName: "$itemDoc.itemName",
            itemMRPperUnit: "$itemDoc.itemMRPperUnit",
            itemSellingPricePerUnit: "$itemDoc.itemSellingPricePerUnit",
            slabPricing: "$itemDoc.slabPricing",
            itemStockQuantity: "$itemQuantityInStore",
            itemPerUnitQuantity: "$itemDoc.itemPerUnitQuantity",
            quantityUnitName: "$itemDoc.quantityUnitName",
            itemShelfDates: "$itemShelfDates",
            sku: "$itemDoc.sku"
          }
        }
      ];

      aggregatedItems = await inventoryColl.aggregate(pipeline).toArray();
      totalItemsCount = aggregatedItems.length;
    } else {
      const itemFilter = {
        permanentlyOutOfStock: false,
        isDeleted: false,
        temporaryDeleted: { $exists: false }
      };

      const allItemsList = await Item.find(itemFilter, null, { sort: { itemName: 1 } })
        .select({
          itemBarcode: 1,
          itemName: 1,
          itemMRPperUnit: 1,
          itemSellingPricePerUnit: 1,
          slabPricing: 1,
          itemStockQuantity: 1,
          itemPerUnitQuantity: 1,
          quantityUnitName: 1,
          itemShelfDates: 1,
          sku: 1
        })
        .lean();

      aggregatedItems = allItemsList.map(item => ({
        _id: item._id,
        itemBarcode: item.itemBarcode,
        itemName: item.itemName,
        itemMRPperUnit: item.itemMRPperUnit,
        itemSellingPricePerUnit: item.itemSellingPricePerUnit,
        slabPricing: item.slabPricing,
        itemStockQuantity: item.itemStockQuantity,
        itemPerUnitQuantity: item.itemPerUnitQuantity,
        quantityUnitName: item.quantityUnitName,
        itemShelfDates: item.itemShelfDates || [],
        sku: item.sku,
        itemQtyInStore: item.itemStockQuantity
      }));
      totalItemsCount = aggregatedItems.length;
    }

    aggregatedItems.forEach(item => {
      const itemWithQty = {
        ...item,
        itemQtyInStore: item.itemStockQuantity,
        itemStockQuantity: item.itemStockQuantity
      };

      itemsNameMap[item.itemName] = itemWithQty;

      if (item.itemBarcode) {
        if (!itemsBarCodeMap[item.itemBarcode]) {
          itemsBarCodeMap[item.itemBarcode] = [];
        }
        itemsBarCodeMap[item.itemBarcode].push(itemWithQty);
      }
    });

    res.status(200).json({
      message: {
        itemsNameMap,
        itemsBarCodeMap,
        totalItemsCount
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getItemsLean;