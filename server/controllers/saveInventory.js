import mongoose from "mongoose";
import { getItemSKU } from "../util/getItemSKU";
import { Item } from "../db-models/item-model";
import PurchaseOrder from "../db-models/purchase-order-model";
import { DealerModel } from "../db-models/dealer-model";
import { getStoreInventoryModel } from "../db-models/storeInventory-model"; 
import { createPOAutoWarehouseToStoreTransaction } from '../util/createPOAutoWarehouseToStoreTransaction';
import { addClearanceToExpiryBatches } from '../util/expiryBatchUtils';
const { CONSTANTS } = require('../constants/constants');

const saveInventory = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Start transaction
  try {
    const {
      newItems,
      purchaseOrderId,
      userDetail,
      storeCode = CONSTANTS.WAREHOUSE_COLLECTION_NAME, 
    } = req.body;
    const referer = req.headers.referer;
    const status  = CONSTANTS.APPROVE;
    const user = req.user;

    const StoreInventory = getStoreInventoryModel(storeCode);

    // Extract valid item IDs
    const itemIds = newItems
      .map((item) => item.item_id)
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    const newItemSkus = newItems.filter((item) => !item.item_id).map(item => item.sku);

    const existingItemsWithIds = await Item.find({ _id: { $in: itemIds } }).lean().session(session);
    const existingItemWithSkus = await Item.find({ sku: { $in: newItemSkus } }).lean().session(session);

    const existingItems = [...existingItemsWithIds, ...existingItemWithSkus];

    // Create a map for quick lookup
    const existingItemsMap = new Map(
      existingItems.map((item) => [item._id.toString(), item])
    );

    let bulkOperations = [];
    let failedItems = [];
    let brandIds = [];
    let companyIds = [];

    newItems.forEach((item) => {
      brandIds.push(item.brandId);
      companyIds.push(item.companyId);
      const newShelfDates = (item.expiryDates || []).map((exp) => ({
        expiryDate: new Date(exp.date),
        quantity: exp.value,
        manufacturingDate: new Date(exp.mfgDate),
        purchaseOrderId: purchaseOrderId,
        entryDate: new Date(),
        currentStockQuantity: exp.value,
        initialStockQuantity: exp.value,
      }));
      const itemDetails = {
        itemName: item.inputName,
        itemBarcode: item.barcode,
        itemStockQuantity: Number(item.stockQuantity) || 0,
        minimumStockQuantity: Number(item.minimumQuantity) || 0,
        itemMRPperUnit: Number(item.mrp) || 0,
        itemCostPricePerUnit: Number(item.costPrice) || 0,
        itemSellingPricePerUnit: Number(item.sellingPrice) || 0,
        useByDate: item.expiryDates || [],
        slabPricing: item.slabPrice || [],
        quantityUnitName: item.unit,
        itemPerUnitQuantity: Number(item.itemQuantity) || 0,
        itemBrandName: item.brand,
        itemCategory: item.category,
        companyName: item.companyName,
        subCategory: item.subCategory,
        flavourOrFeature: item.flavourOrFeature,
        itemShelfDates: newShelfDates,
        shelfLife: item.shelfLife,
        saleTime: item.saleTime,
        returnPolicyAvailable: item.returnPolicyAvailable,
        returnPolicyRemark: item.returnPolicyRemark,
        freeItemAvailable: item.freeItemAvailable,
        brandId: item.brandId,
        companyId: item.companyId,
        sku: getItemSKU({
          itemQuantity: item?.itemQuantity,
          unit: item?.unit,
          mrp: item?.mrp,
          barcode: item?.barcode,
          itemName: item?.inputName,
        }),
      };

      const oldItem = existingItemsMap.get(item.item_id);

      if (oldItem) {
        let oldItemCost = Number(oldItem.itemCostPricePerUnit) || 0;
        let oldStock = Number(oldItem.itemStockQuantity) || 0;
        let newItemCost = itemDetails.itemCostPricePerUnit;
        let newStock = itemDetails.itemStockQuantity;
        let totalStock = oldStock + newStock;
        let newCostPrice =
          totalStock > 0
            ? (oldItemCost * oldStock + newItemCost * newStock) / totalStock
            : 0;
        let newUseByDate = mergeExpiryDates(oldItem.useByDate, itemDetails.useByDate);
        let new_Item_Update = {
          ...itemDetails,
          itemCostPricePerUnit: isNaN(newCostPrice)
            ? 0
            : parseFloat(newCostPrice.toFixed(2)),
          useByDate: newUseByDate,
          itemStockQuantity: totalStock,
          itemPerUnitQuantity: itemDetails.itemPerUnitQuantity,
        };
        const { itemShelfDates, ...restItemUpdate } = new_Item_Update;
        bulkOperations.push({
          updateOne: {
            filter: { _id: item.item_id },
            update: { $set: restItemUpdate, $push: { itemShelfDates: { $each: newShelfDates } } },
          },
        });
      } else {
        bulkOperations.push({
          insertOne: {
            document: {
              ...itemDetails,
              createdFromPO: purchaseOrderId,
            },
          },
        });
      }
    });

    let bulkWriteResult = {};
    if (bulkOperations.length > 0) {
      bulkWriteResult = await Item.bulkWrite(bulkOperations, { session });
    }

    const insertedIds = bulkWriteResult.insertedIds
      ? Object.values(bulkWriteResult.insertedIds)
      : [];

    const newlyInsertedItems = await Item.find({ _id: { $in: insertedIds } })
      .select('sku _id')
      .lean()
      .session(session);

    const skuToIdMap = newlyInsertedItems.reduce((m, doc) => {
      m[doc.sku] = doc._id;
      return m;
    }, {});

    let storeBulkOps = [];
    newItems.forEach((item) => {
      const realId = item.item_id
        ? new mongoose.Types.ObjectId(item.item_id)
        : skuToIdMap[item.sku];
      const itemQuantity = Number(item.stockQuantity) || 0;
      const stockChangeDateTime = new Date();
      const newShelfDates = (item.expiryDates || []).map((exp) => ({
        expiryDate: new Date(exp.date),
        quantity: exp.value,
        manufacturingDate: new Date(exp.mfgDate),
        purchaseOrderId: purchaseOrderId,
        entryDate: new Date(),
        currentStockQuantity: exp.value,
        initialStockQuantity: exp.value,
      }));
      storeBulkOps.push({
        updateOne: {
          filter: { itemId: realId },
          update: {
            $inc: { itemQuantityInStore: itemQuantity },
            $push: {
              itemStockChangeHistory: {
                quantity: itemQuantity,
                dateTime: stockChangeDateTime,
                user: user._id,
                changeType: CONSTANTS.ADD,
                changedFrom: CONSTANTS.WAREHOUSE,
                transactionId: purchaseOrderId,
              },
              itemShelfDates: { $each: newShelfDates },
            },
          },
          upsert: true,
        },
      });
    });

    if (storeBulkOps.length > 0) {
      await StoreInventory.bulkWrite(storeBulkOps, { session });
    }

    const skuToIdArray = newlyInsertedItems.map((item) => ({
      sku: item.sku,
      id: item._id,
    }));

    const purchaseOrderItemBulkUpdates = skuToIdArray.map(({ sku, id }) => ({
      updateOne: {
        filter: { _id: purchaseOrderId, 'purchasedItems.sku': sku },
        update: { $set: { 'purchasedItems.$.item_id': id } },
      },
    }));

    if (purchaseOrderItemBulkUpdates.length > 0) {
      await PurchaseOrder.bulkWrite(purchaseOrderItemBulkUpdates, { session });
    }

    const staffId = user?._id?.toString();    
    const newPOItems = newItems
      .filter(item => !item.item_id)
      .map(item => {
        const insertedItems = newlyInsertedItems.find(i => i.sku === item.sku);
        return insertedItems ? { itemId: insertedItems._id.toString(), poQty: Number(item.stockQuantity) || 0 } : null;
      })
      .filter(Boolean);      

    if (newPOItems.length > 0 && staffId) {
      try {
      await createPOAutoWarehouseToStoreTransaction({
        staffId,
        newItems: newPOItems,
      });
    } catch(err) {
      console.error(err)
      }

    }

    failedItems = newItems.filter(
      (item) =>
        !bulkWriteResult.insertedCount &&
        !bulkWriteResult.modifiedCount &&
        item.inputName
    );

    if (failedItems.length === newItems.length) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({
        message: "No items were added to the inventory.",
        success: false,
      });
    }

    if (failedItems.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(429).json({
        message: `Some items could not be processed: ${failedItems
          .map((item) => item.inputName)
          .join(", ")}`,
        success: false,
      });
    }
    
    const newStatusHistory = {
      data: {
        userId:  user._id,
        status: status,
        browser: userDetail ? userDetail.browser : "Unknown",
        os:  userDetail ? userDetail.os : "Unknown",
        ipAddress: userDetail ? userDetail.ipAddress : "Unknown",
        referer: referer, 
      },
    };

    const getPurchaseOrder = await PurchaseOrder.findById(purchaseOrderId);
    const dealerId = getPurchaseOrder.dealerId;
    let updatedDealer;

    if (dealerId) {
      updatedDealer = await DealerModel.findByIdAndUpdate(
        dealerId,
        {
          $addToSet: {
            dealerCompanies: { $each: companyIds },
            dealerBrands: { $each: brandIds },
          },
        },
        { new: true }
      );
    }
    
    const order = await PurchaseOrder.findByIdAndUpdate(
      purchaseOrderId,
      {
        isApproved: true,
        approveTime: Date.now(),
        $push: { statusHistory: newStatusHistory },
      },
      { new: true, session }
    );

    // After approval, if there are expiry batches, add clearance (fire and forget)
    if (order && Array.isArray(order.expiryBatches) && order.expiryBatches.length > 0) {      
     await addClearanceToExpiryBatches(order.expiryBatches, order._id.toString(), 'Order Approved');
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "All items updated and Order Approved successfully",
      order,
      success: true,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

const mergeExpiryDates = (oldDates = [], newDates = []) => {
  const dateMap = new Map();

  [...oldDates, ...newDates].forEach(({ date, value }) => {
    const formattedDate = new Date(date).toLocaleDateString();
    dateMap.set(formattedDate, (dateMap.get(formattedDate) || 0) + value);
  });

  return Array.from(dateMap, ([date, value]) => ({ date, value }));
};

export default saveInventory;
