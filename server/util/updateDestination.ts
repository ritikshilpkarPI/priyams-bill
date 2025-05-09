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
  transactionId?: mongoose.Types.ObjectId;
};

export const updateDestination = async ({
  userId,
  items,
  destinationType,
  destinationEntityId,
  transactionId,
}: UpdateDestinationParams) => {
  const updatedItems = [];

  if (destinationType === CONSTANTS.WAREHOUSE) {
    for (const { itemId, quantity, itemShelfDates = [] } of items) {
      if (!itemId || !quantity)
        throw new Error(MESSAGES.MISSING_REQUIRED_FIELDS);

      const item = await Item.findById(itemId);
      if (!item) throw new Error(MESSAGES.NO_ITEMS_FOUND);

      item.itemStockQuantity += quantity;
      updateItemShelfDates(
        item.itemShelfDates,
        itemShelfDates,
        transactionId,
        'ADD'
      );
      await item.save();

      updatedItems.push({ updatedItem: item });
    }
  } else if (destinationType === CONSTANTS.STORE) {
    const store = await StoreModel.findById(destinationEntityId);
    if (!store) throw new Error('Store not found');

    const StoreInventory = getStoreInventoryModel(store.collectionName);

    for (const { itemId, quantity, itemShelfDates = [] } of items) {
      let storeItem = await StoreInventory.findOne({ itemId });   
        
      if (!storeItem) {
        storeItem = new StoreInventory({
          itemId,
          itemQuantityInStore: quantity,
          itemShelfDates: itemShelfDates.map((shelf) => ({
            ...shelf,
            initialStockQuantity:
              shelf.quantityToAdd ?? shelf.initialStockQuantity ?? 0,
            currentStockQuantity:
              shelf.quantityToAdd ?? shelf.currentStockQuantity ?? 0,
            transactionId,
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
        updateItemShelfDates(
          storeItem.itemShelfDates,
          itemShelfDates,
          transactionId,
          'ADD'
        );
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
      updatedItems.push({ updatedItem: storeItem });
    }
  }

  return updatedItems;
};
