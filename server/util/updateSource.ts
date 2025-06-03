import mongoose from 'mongoose';
import { Item } from '../db-models/item-model';
import { StoreModel } from '../db-models/store-model';
import { MESSAGES } from '../constants/messages';
import { CONSTANTS } from '../constants/constants';
import { updateItemShelfDates } from './updateItemShelfDates';
import { getStoreInventoryModel } from '../db-models/storeInventory-model';

type ItemInput = {
  itemId: string;
  quantity: number;
  itemShelfDates: any[];
};

type UpdateSourceParams = {
  userId: string;
  items: ItemInput[];
  sourceType: string;
  sourceEntityId: string;
  transactionId?: mongoose.Types.ObjectId;
};

export const updateSource = async ({
  userId,
  items,
  sourceType,
  sourceEntityId,
  transactionId,
}: UpdateSourceParams) => {
  const updatedItems = [];

  if (sourceType === CONSTANTS.STORE || CONSTANTS.WAREHOUSE) {
    const store = await StoreModel.findById(sourceEntityId);
    if (!store) throw new Error(MESSAGES.STORE_NOT_FOUND ?? 'Store not found');

    const StoreInventory = getStoreInventoryModel(store.collectionName);

    for (const { itemId, quantity, itemShelfDates = [] } of items) {
      if (!itemId || quantity == null) {
        throw new Error(MESSAGES.MISSING_REQUIRED_FIELDS);
      }

      const storeItem = await StoreInventory.findOne({ itemId });
      if (!storeItem || storeItem.itemQuantityInStore < quantity) {
        throw new Error(MESSAGES.INSUFFICIENT_STORE_STOCK);
      }

      updateItemShelfDates(
        storeItem.itemShelfDates,
        itemShelfDates,
        transactionId,
        'SUBTRACT'
      );
      storeItem.itemQuantityInStore -= quantity;

      storeItem.itemStockChangeHistory.push({
        quantity: -quantity,
        user: userId,
        changeType: CONSTANTS.REMOVE,
        changedFrom: CONSTANTS.STORE,
        transactionId,
      });

      await storeItem.save();
      updatedItems.push({ updatedItem: storeItem });
    }
  }

  return updatedItems;
};
