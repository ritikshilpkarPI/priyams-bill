import { getStoreInventoryModel } from '../db-models/storeInventory-model';
import { Item } from '../db-models/item-model';
import { CONSTANTS } from '../constants/constants';
import { MESSAGES } from '../constants/messages';

export const transferStockToWarehouse = async ({
  items,
  collectionName,
  userId,
}: {
  items: { itemId: string; quantity: number }[];
  collectionName: string;
  userId: string;
}) => {
  const StoreInventory = getStoreInventoryModel(collectionName);
  const updatedItems = [];

  for (const { itemId, quantity } of items) {
    if (!itemId || !quantity) {
      throw new Error(MESSAGES.MISSING_REQUIRED_FIELDS);
    }

    // Decrease from store
    const storeItem = await StoreInventory.findOne({ itemId });
    if (!storeItem || storeItem.itemQuantityInStore < quantity) {
      throw new Error(MESSAGES.INSUFFICIENT_STORE_STOCK);
    }

    storeItem.itemQuantityInStore -= quantity;
    storeItem.itemStockChangeHistory.push({
      quantity: -quantity,
      user: userId,
      changeType: CONSTANTS.REMOVE,
      changedFrom: CONSTANTS.STORE,
    });
    await storeItem.save();

    // Increase in warehouse (Item collection)
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { $inc: { itemStockQuantity: quantity } },
      { new: true }
    );

    updatedItems.push({ storeItem, updatedItem });
  }

  return updatedItems;
};
