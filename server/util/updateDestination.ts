import mongoose from 'mongoose';
import { Item } from '../db-models/item-model';
import { CONSTANTS } from '../constants/constants';
import { MESSAGES } from '../constants/messages';
import { StoreModel } from '../db-models/store-model';
import { getStoreInventoryModel } from '../db-models/storeInventory-model';
import { updateItemShelfDates } from './updateItemShelfDates';


type ItemInput = {
  itemId: string;
  quantity: number;
  itemShelfDates: any[];
};
type UpdateDestinationParams = {
  userId: string;
  items: ItemInput[];
  destinationType: string;
  destinationEntityId: string;
  transactionId: string;
}

interface StoreInventoryItem {
  _id: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  itemQuantityInStore: number;
  itemShelfDates: any[];
  itemStockChangeHistory: any[];
}

export const updateDestination = async ({
  userId,
  items,
  destinationType,
  destinationEntityId,
  transactionId,
}: UpdateDestinationParams) => {
  const updatedItems = [];

  if (destinationType === CONSTANTS.WAREHOUSE) {
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
    
    const itemsMap = new Map(
      (await Item.find({ _id: { $in: itemIds } })).map(item => [item._id.toString(), item])
    );

    const bulkOps = [];
    for (const { itemId, quantity, itemShelfDates = [] } of items) {
      if (!itemId || quantity == null) {
        throw new Error(MESSAGES.MISSING_REQUIRED_FIELDS);
      }

      const itemIdStr = String(itemId);
      const item = itemsMap.get(itemIdStr);
      if (!item) {
        throw new Error(MESSAGES.NO_ITEMS_FOUND);
      }

      item.itemStockQuantity += quantity;
      updateItemShelfDates(
        item.itemShelfDates,
        itemShelfDates,
        new mongoose.Types.ObjectId(transactionId),
        'ADD'
      );

      bulkOps.push({
        updateOne: {
          filter: { _id: item._id },
          update: {
            $set: {
              itemStockQuantity: item.itemStockQuantity,
              itemShelfDates: item.itemShelfDates
            }
          }
        }
      });

      updatedItems.push({ updatedItem: item });
    }

    if (bulkOps.length > 0) {
      await Item.bulkWrite(bulkOps);
    }
  } else if (destinationType === CONSTANTS.STORE) {
    const store = await StoreModel.findById(destinationEntityId);
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
      if (!storeItem) {
        throw new Error(MESSAGES.NO_ITEMS_FOUND);
      }

      updateItemShelfDates(
        storeItem.itemShelfDates,
        itemShelfDates,
        new mongoose.Types.ObjectId(transactionId),
        'ADD'
      );
      storeItem.itemQuantityInStore += quantity;

      storeItem.itemStockChangeHistory.push({
        quantity,
        user: new mongoose.Types.ObjectId(userId),
        changeType: CONSTANTS.ADD,
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

    // Execute bulk operation
    if (bulkOps.length > 0) {
      await StoreInventory.bulkWrite(bulkOps);
    }
  }

  return updatedItems;
};
