import { getStoreInventoryModel } from '../db-models/storeInventory-model';
import { Item } from '../db-models/item-model';
import { CONSTANTS } from '../constants/constants';
import { MESSAGES } from '../constants/messages';
import mongoose from 'mongoose';

export const subtractFromSourceInventory = async ({
  items,
  collectionName,
  userId,
  sourceType,
  transactionId
}: {
  items: { itemId: string; quantity: number }[];
  collectionName: string;
  userId: string;
  sourceType: 'STORE' | 'WAREHOUSE';
  transactionId?: mongoose.Types.ObjectId;
}) => {
  if (sourceType === CONSTANTS.STORE) {
    const StoreInventory = getStoreInventoryModel(collectionName);

    for (const { itemId, quantity } of items) {
      if (!itemId || !quantity) {
        throw new Error(MESSAGES.MISSING_REQUIRED_FIELDS);
      }

      const storeItem = await StoreInventory.findOne({ itemId });
      if (!storeItem || storeItem.itemQuantityInStore < quantity) {
        throw new Error(`${MESSAGES.INSUFFICIENT_STORE_STOCK} for item ${itemId}`);
      }

      storeItem.itemQuantityInStore -= quantity;
      storeItem.itemStockChangeHistory.push({
        quantity: -quantity,
        user: userId,
        changeType: CONSTANTS.REMOVE,
        changedFrom: CONSTANTS.STORE,
        transactionId
      });

      await storeItem.save();
    }
  }

  if (sourceType === CONSTANTS.WAREHOUSE) {
    for (const { itemId, quantity } of items) {
      if (!itemId || !quantity) {
        throw new Error(MESSAGES.MISSING_REQUIRED_FIELDS);
      }

      const item = await Item.findById(itemId);
      if (!item) {
        throw new Error(`${MESSAGES.INSUFFICIENT_STOCK} for item ${itemId}`);
      }

      item.itemStockQuantity -= quantity;
      await item.save();
    }
  }
};
