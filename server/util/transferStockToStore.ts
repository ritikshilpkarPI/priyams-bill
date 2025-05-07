import { getStoreInventoryModel } from '../db-models/storeInventory-model';
import { Item } from '../db-models/item-model';
import { CONSTANTS } from '../constants/constants';
import { MESSAGES } from '../constants/messages';
import mongoose from 'mongoose';
import { StoreModel } from '../db-models/store-model';

/**
 * Transfers stock from warehouse (Item collection) to store (dynamic inventory collection)
 */
export const transferStockToStore = async ({
  items,
  storeId,
  userId,
  transactionId,
}: {
  items: { itemId: string; quantity: number; itemShelfDates: any }[];
  storeId: mongoose.Types.ObjectId;
  userId: string;
  transactionId?: mongoose.Types.ObjectId;
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

    // Check warehouse stock
    const item = await Item.findById(itemId);
    if (!item) {
      throw new Error(MESSAGES.NO_ITEMS_FOUND);
    }

    // Decrease from warehouse
    item.itemStockQuantity -= quantity;

    for (let inputShelf of itemShelfDates) {
      const inputExpiry = new Date(inputShelf.expiryDate ?? '').getTime();
      const inputMfg = new Date(inputShelf.manufacturingDate ?? '').getTime();

      const matchingShelf = item.itemShelfDates.find((shelf) => {
        const shelfExpiry = new Date(shelf.expiryDate ?? '').getTime();
        const shelfMfg = new Date(shelf.manufacturingDate ?? '').getTime();
        return shelfExpiry === inputExpiry && shelfMfg === inputMfg;
      });

      if (matchingShelf) {
        matchingShelf.currentStockQuantity -= inputShelf.quantityToAdd;
      }
    }

    // Add to store
    let storeItem = await StoreInventory.findOne({ itemId });
    if (!storeItem) {
      storeItem = new StoreInventory({
        itemId,
        itemQuantityInStore: quantity,
        itemShelfDates: itemShelfDates.map(
          (shelf: {
            quantityToAdd: number;
            currentStockQuantity: number;
            initialStockQuantity: number;
          }) => ({
            ...shelf,
            initialStockQuantity:
              shelf.quantityToAdd ?? shelf.initialStockQuantity ?? 0,
            currentStockQuantity:
              shelf.quantityToAdd ?? shelf.currentStockQuantity ?? 0,
            transactionId,
          })
        ),
        itemStockChangeHistory: [
          {
            quantity,
            user: userId,
            changeType: CONSTANTS.ADD,
            changedFrom: CONSTANTS.WAREHOUSE,
            transactionId,
          },
        ],
      });
    } else {
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
            (matchingShelf.currentStockQuantity ?? 0) +
            (inputShelf.quantityToAdd ?? 0);
        } else {
          storeItem.itemShelfDates.push({
            ...inputShelf,
            initialStockQuantity:
              inputShelf.quantityToAdd ?? inputShelf.initialStockQuantity ?? 0,
            currentStockQuantity:
              inputShelf.quantityToAdd ?? inputShelf.currentStockQuantity ?? 0,
            transactionId: transactionId ?? new mongoose.Types.ObjectId(),
          });
        }
      }
      storeItem.itemQuantityInStore += quantity;
      storeItem.itemStockChangeHistory.push({
        quantity,
        user: userId,
        changeType: CONSTANTS.ADD,
        changedFrom: CONSTANTS.WAREHOUSE,
        transactionId,
      });
    }

    await storeItem.save();
    await item.save();

    updatedItems.push({ storeItem, updatedItem: item });
  }

  return updatedItems;
};
