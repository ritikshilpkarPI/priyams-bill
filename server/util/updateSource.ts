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
  transactionId: string;
}

interface StoreInventoryItem {
  _id: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  itemQuantityInStore: number;
  itemShelfDates: any[];
  itemStockChangeHistory: any[];
}

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

    const itemIds = items.map(item => {
      if (!item.itemId) {
        throw new Error('Missing itemId in item data');
      }
      
      try {
        const itemIdStr = String(item.itemId);
        return new mongoose.Types.ObjectId(itemIdStr);
      } catch (error) {
        throw new Error(`Invalid itemId format: ${JSON.stringify(item.itemId)}`);
      }
    });
    
    const storeItemsMap = new Map(
      (await StoreInventory.find({ itemId: { $in: itemIds } })).map((item: StoreInventoryItem) => [item.itemId.toString(), item])
    );

    const bulkOps = [];
    for (const { itemId, quantity, itemShelfDates = [] } of items) {
      if (!itemId || quantity == null) {
        throw new Error(MESSAGES.MISSING_REQUIRED_FIELDS);
      }

      const itemIdStr = String(itemId);
      const storeItem = storeItemsMap.get(itemIdStr) as StoreInventoryItem | undefined;
      if (!storeItem || storeItem.itemQuantityInStore < quantity) {
        throw new Error(MESSAGES.INSUFFICIENT_STORE_STOCK);
      }

      updateItemShelfDates(
        storeItem.itemShelfDates,
        itemShelfDates,
        new mongoose.Types.ObjectId(transactionId),
        'SUBTRACT'
      );
      storeItem.itemQuantityInStore -= quantity;

      storeItem.itemStockChangeHistory.push({
        quantity: -quantity,
        user: new mongoose.Types.ObjectId(userId),
        changeType: CONSTANTS.REMOVE,
        changedFrom: CONSTANTS.STORE,
        transactionId: new mongoose.Types.ObjectId(transactionId),
      });

      bulkOps.push({
        updateOne: {
          filter: { _id: storeItem._id },
          update: {
            $set: {
              itemQuantityInStore: storeItem.itemQuantityInStore,
              itemShelfDates: storeItem.itemShelfDates,
              itemStockChangeHistory: storeItem.itemStockChangeHistory
            }
          }
        }
      });

      updatedItems.push({ updatedItem: storeItem });
    }

    if (bulkOps.length > 0) {
      await StoreInventory.bulkWrite(bulkOps);
    }
  }

  return updatedItems;
};
