const { Item } = require('../db-models/item-model');
const { PStoreCartItemModel } = require('../db-models/pstorecart-item-model');

const addItemsToCartApp = async (req, res) => {
  try {
    const { items } = req.body;

    // Iterate over each item in the request body
    for (const itemData of items) {
      const { _id:id, quantity } = itemData;

      // Find the item from the Item model by id
      const itemToMove = await Item.findById(id);

      if (!itemToMove) {
        console.log(`Item with ID ${id} not found`);
        continue; // Move to the next item if not found
      }

      // Ensure the item quantity is not negative
      if (itemToMove.itemStockQuantity < quantity) {
        console.log(`Insufficient stock for item with ID ${id}`);
        continue; // Move to the next item if insufficient stock
      }

      // Check if the product already exists in the PStoreCartItemModel
      let existingItem = await PStoreCartItemModel.findOne({ itemName: itemToMove.itemName });

      if (existingItem) {
        // If the product already exists, add the new quantity to the existing quantity
        existingItem.itemStockQuantity += quantity;
        await existingItem.save();
        console.log(`${itemToMove.itemName} quantity updated to ${existingItem.itemStockQuantity}`);
      } else {
        // Prepare data to be saved in PStoreCartItemModel
        const itemDataForCart = {
          itemName: itemToMove.itemName,
          itemBarcode: itemToMove.itemBarcode,
          itemStockQuantity: quantity,
          minimumStockQuantity: itemToMove.minimumStockQuantity,
          itemMRPperUnit: itemToMove.itemMRPperUnit,
          itemDiscountPerUnit: itemToMove.itemDiscountPerUnit,
          itemPerUnitDiscountPercentage: itemToMove.itemPerUnitDiscountPercentage,
          isDeleted: itemToMove.isDeleted,
          permanentlyOutOfStock: itemToMove.permanentlyOutOfStock,
          itemCostPricePerUnit: itemToMove.itemCostPricePerUnit,
          itemSellingPricePerUnit: itemToMove.itemSellingPricePerUnit,
          slabPricing: itemToMove.slabPricing,
          minStockReached: itemToMove.minStockReached,
          itemBrandName: itemToMove.itemBrandName,
          itemCategory: itemToMove.itemCategory,
          useByDate: itemToMove.useByDate,
          quantityUnitName: itemToMove.quantityUnitName,
          gstPercentage: itemToMove.gstPercentage,
          itemPerUnitQuantity: itemToMove.itemPerUnitQuantity,
          images: itemToMove.images,
        };

        // Create a new item in the PStoreCartItemModel
        await PStoreCartItemModel.create(itemDataForCart);
        console.log(`${itemToMove.itemName} is added successfully`);
      }

      // Reduce the itemStockQuantity from the Item model
      itemToMove.itemStockQuantity -= quantity;
      await itemToMove.save();
    }

    res.status(200).json({
      message: `Items added to pstore cart app`,
      status: true,
    });
  } catch (error) {
    console.log(`Failed to move data to cart app`, error);
    res.status(500).json({ status: false, message: error });
  }
};

module.exports = addItemsToCartApp;
