const { Item } = require('../db-models/item-model');
const mongoose = require('mongoose');

const saveInventory = async (req, res, next) => {
  try {
    const { new_items } = req.body;
    for (const item of new_items) {
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
      };

      let oldItem;
      // Check if item_id is valid before calling findById
      if (item.item_id && mongoose.Types.ObjectId.isValid(item.item_id)) {
        oldItem = await Item.findById(item.item_id);
      }

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

        let newTotalStock = newStock + oldStock;
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

        await oldItem.updateOne(new_Item_Update, { new: true });
      } else {
        await Item.create(itemDetails);
      }
    }

    res.status(200).send({ message: 'Items updated', success: true });
  } catch (error) {
    next(error);
  }
};

// Helper function to merge expiry dates
const mergeExpiryDates = (oldDates, newDates) => {
  const mergedDates = [];

  newDates.forEach((newData) => {
    let dateExists = false;

    oldDates.forEach((oldData) => {
      if (
        new Date(oldData.date).toLocaleDateString() ===
        new Date(newData.date).toLocaleDateString()
      ) {
        dateExists = true;
        const totalExpiryItems = newData.value + oldData.value;
        mergedDates.push({ date: newData.date, value: totalExpiryItems });
      }
    });

    if (!dateExists) {
      mergedDates.push({ ...newData });
    }
  });

  oldDates.forEach((oldData) => {
    const dateExists = newDates.some(
      (newData) =>
        new Date(oldData.date).toLocaleDateString() ===
        new Date(newData.date).toLocaleDateString()
    );

    if (!dateExists) {
      mergedDates.push({ ...oldData });
    }
  });

  return mergedDates;
};

module.exports = saveInventory;
