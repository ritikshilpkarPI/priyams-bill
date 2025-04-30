import { getStoreInventoryModel } from '../db-models/storeInventory-model';
import { Item } from '../db-models/item-model';
import { CONSTANTS } from '../constants/constants';
import { MESSAGES } from '../constants/messages';
import mongoose from 'mongoose';
import { StoreModel } from '../db-models/store-model';

export const transferStockToWarehouse = async ({
  items,
  storeId,
  userId,
}: {
  items: { itemId: string; quantity: number; itemShelfDates: any }[];
  storeId: mongoose.Types.ObjectId;
  userId: string;
}) => {

  const store = await StoreModel.findById(storeId);
  if (!store) {
     throw new Error('Store not found');
  }
  const collectionName = store.collectionName;

  const StoreInventory = getStoreInventoryModel(collectionName);
  const updatedItems = [];

  for (const { itemId, quantity, itemShelfDates = [] } of items) {
    if (!itemId || !quantity) {
      throw new Error(MESSAGES.MISSING_REQUIRED_FIELDS);
    }

    // Decrease from store
    const storeItem = await StoreInventory.findOne({ itemId });
    if (!storeItem || storeItem.itemQuantityInStore < quantity) {
      throw new Error(MESSAGES.INSUFFICIENT_STORE_STOCK);
    }

    for (let inputShelf of itemShelfDates) {
      const inputExpiry = new Date(inputShelf.expiryDate ?? '').getTime();
      const inputMfg = new Date(inputShelf.manufacturingDate ?? '').getTime();

      const matchingShelf = storeItem.itemShelfDates.find((shelf) => {
        const shelfExpiry = new Date(shelf.expiryDate ?? '').getTime();
        const shelfMfg = new Date(shelf.manufacturingDate ?? '').getTime();
        return shelfExpiry === inputExpiry && shelfMfg === inputMfg;
      });

      if (matchingShelf) {
        matchingShelf.currentStockQuantity =
          (matchingShelf.currentStockQuantity ?? 0) -
          (inputShelf.quantityToAdd ?? 0);
      }
    }
    storeItem.itemQuantityInStore -= quantity;
    storeItem.itemStockChangeHistory.push({
      quantity: -quantity,
      user: userId,
      changeType: CONSTANTS.REMOVE,
      changedFrom: CONSTANTS.STORE,
    });

    const updatedItem = await Item.findById(itemId);
    if (!updatedItem) throw new Error(MESSAGES.NO_ITEMS_FOUND);

    updatedItem.itemStockQuantity += quantity;

    for (let inputShelf of itemShelfDates) {
      const inputExpiry = new Date(inputShelf.expiryDate ?? '').getTime();
      const inputMfg = new Date(inputShelf.manufacturingDate ?? '').getTime();

      const matchingShelf = updatedItem.itemShelfDates.find((shelf) => {
        const shelfExpiry = new Date(shelf.expiryDate ?? '').getTime();
        const shelfMfg = new Date(shelf.manufacturingDate ?? '').getTime();
        return shelfExpiry === inputExpiry && shelfMfg === inputMfg;
      });

      if (matchingShelf) {
        matchingShelf.currentStockQuantity += inputShelf.quantityToAdd;
      }
    }

    await updatedItem.save();
    await storeItem.save();
    updatedItems.push({ storeItem, updatedItem });
  }

  return updatedItems;
};
