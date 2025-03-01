import mongoose from "mongoose";
import { getItemSKU } from "../util/getItemSKU";
import { Item } from "../db-models/item-model";
import PurchaseOrder from "../db-models/purchase-order-model";
const { APP_ENVIRONMENT } = require('../util/constants/appEnvironment');

const saveInventory = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Start transaction
  try {
    const { newItems, purchaseOrderId, userDetail } = req.body; 
    const referer = req.headers.referer;
    const status  = APP_ENVIRONMENT.APPROVE
    const user = req.user;
    
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

    newItems.forEach((item) => {
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
        itemShelfDate: {
          expiryDates: item.expiryDates,
          manufacturingDates: item.manufacturingDates,
        },
        shelfLife: item.shelfLife,
        saleTime: item.saleTime,
        returnPolicyAvailable: item.returnPolicyAvailable,
        returnPolicyRemark: item.returnPolicyRemark,
        freeItemAvailable: item.freeItemAvailable,
        sku: getItemSKU({
          itemQuantity: item?.itemQuantity,
          unit: item?.unit,
          mrp: item?.mrp,
          barcode: item?.barcode,
          itemName: item?.inputName,
        })
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

        let newTotalStock = oldStock + newStock;
        let newTotalItemQuantity =
          itemDetails.itemPerUnitQuantity + oldItem.itemPerUnitQuantity;

        let newUseByDate = mergeExpiryDates(
          oldItem.useByDate,
          itemDetails.useByDate
        );

        let new_Item_Update = {
          ...itemDetails,
          itemCostPricePerUnit: isNaN(newCostPrice)
            ? 0
            : parseFloat(newCostPrice.toFixed(2)),
          useByDate: newUseByDate,
          itemStockQuantity: newTotalStock,
          itemPerUnitQuantity: newTotalItemQuantity,
        };

        bulkOperations.push({
          updateOne: {
            filter: { _id: item.item_id },
            update: { $set: new_Item_Update },
          },
        });
      } else {
        bulkOperations.push({
          insertOne: { document: itemDetails },
        });
      }
    });

    // Execute bulk operation if there are any updates
    let bulkWriteResult = {};
    if (bulkOperations.length > 0) {
      bulkWriteResult = await Item.bulkWrite(bulkOperations, { session });
      console.log({bulkWriteResult});
      
    }

    // Identify failed items
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
        browser: userDetail.browser || 'Unknown',
        os: userDetail.os || 'Unknown',
        ipAddress: userDetail.ipAddress || 'Unknown',
        referer: referer, 
      },
    };
    
    // If all items are successfully inserted or updated, approve the purchase order
    const order = await PurchaseOrder.findByIdAndUpdate(
      purchaseOrderId,
      {
        isApproved: true,
        approveTime: Date.now(),
        $push: { statusHistory: newStatusHistory },
      },
      { new: true, session }
    );

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

// Optimized helper function to merge expiry dates
const mergeExpiryDates = (oldDates, newDates) => {
  const dateMap = new Map();

  [...oldDates, ...newDates].forEach(({ date, value }) => {
    const formattedDate = new Date(date).toLocaleDateString();
    dateMap.set(formattedDate, (dateMap.get(formattedDate) || 0) + value);
  });

  return Array.from(dateMap, ([date, value]) => ({ date, value }));
};

export default saveInventory;