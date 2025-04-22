import { getStoreInventoryModel } from '../db-models/storeInventory-model';
import { Item } from '../db-models/item-model';
import { CONSTANTS } from '../constants/constants';
import { MESSAGES } from '../constants/messages';
import mongoose from 'mongoose';

/**
 * Transfers stock from warehouse (Item collection) to store (dynamic inventory collection)
 */
export const transferStockToStore = async ({
  items,
  collectionName,
  userId,
  transactionId,
}: {
  items: { itemId: string; quantity: number, itemShelfDates: any }[];
  collectionName: string;
  userId: string;
  transactionId?: mongoose.Types.ObjectId;
}) => {
  const StoreInventory = getStoreInventoryModel(collectionName);
  const updatedItems = [];

  for (const { itemId, quantity, itemShelfDates=[] } of items) {
    if (!itemId || !quantity) {
      throw new Error(MESSAGES.MISSING_REQUIRED_FIELDS);
    }

    // Check warehouse stock
    const item = await Item.findById(itemId);
    if (!item || item.itemStockQuantity < quantity) {
      throw new Error(MESSAGES.INSUFFICIENT_STOCK);
    }

    // Decrease from warehouse
    item.itemStockQuantity -= quantity;
    await item.save();

    // Add to store
    let storeItem = await StoreInventory.findOne({ itemId });
    if (!storeItem) {
      storeItem = new StoreInventory({
        itemId,
        itemQuantityInStore: quantity,
        itemShelfDates: itemShelfDates.map((shelf: { quantityToAdd: number; }) => ({
            ...shelf,
            initialStockQuantity: shelf.quantityToAdd,
            currentStockQuantity: shelf.quantityToAdd,
          })),
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
      storeItem.itemQuantityInStore += quantity;
      const shelfMap = new Map(
        storeItem?.itemShelfDates?.map((shelf) => [shelf._id?.toString(), shelf])
      );
    
      for (const shelf of itemShelfDates) {
        const { _id, quantityToAdd } = shelf;
        const key = _id?.toString();
    
        if (key && shelfMap.has(key)) {
          shelfMap.get(key)!.currentStockQuantity += quantityToAdd;
        } else {
          storeItem?.itemShelfDates?.push({
            ...shelf,
            initialStockQuantity: quantityToAdd,
            currentStockQuantity: quantityToAdd,
          });
        }
      }
      storeItem.itemStockChangeHistory.push({
        quantity,
        user: userId,
        changeType: CONSTANTS.ADD,
        changedFrom: CONSTANTS.WAREHOUSE,
        transactionId,
      });
    }

    await storeItem.save();

    updatedItems.push({ storeItem, updatedItem: item });
  }

  return updatedItems;
};
