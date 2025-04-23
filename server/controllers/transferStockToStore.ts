import { NextFunction, Request, Response } from 'express';
import { MESSAGES } from '../constants/messages';
import { CONSTANTS } from '../constants/constants';
import { getStoreInventoryModel } from '../db-models/storeInventory-model';
import { Item } from '../db-models/item-model';
import { AuthenticatedRequest } from 'server/types';

export const transferStockToStore = async (
  req: Request & AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      items,
      collectionName,
      changeType = CONSTANTS.ADD,
      changedFrom = CONSTANTS.WAREHOUSE,
    } = req.body;
    const userId = req.user?._id;

    if (!collectionName || !items?.length || !userId) {
      return res
        .status(404)
        .json({ message: MESSAGES.MISSING_REQUIRED_FIELDS, success: false });
    }

    const StoreInventory = getStoreInventoryModel(collectionName);
    const updatedItems = [];

    for (const { itemId, quantity, itemShelfDates = [] } of items) {

      if (!itemId || !quantity) {
        return res.status(400).json({ message: MESSAGES.MISSING_REQUIRED_FIELDS, success: false });
      }

      const item = await Item.findOne({ _id:itemId });
      if (!item) {
        return res.status(400).json({ message: MESSAGES.NO_ITEMS_FOUND, success: false });
      }

      let storeItem = await StoreInventory.findOne({ itemId });
      if (!storeItem) {
        storeItem = new StoreInventory({
          itemId,
          itemQuantityInStore: quantity,
          itemShelfDates: itemShelfDates.map((shelf: { quantityToAdd: number; }) => ({
            ...shelf,
            quantity: shelf.quantityToAdd,
          })),
          
          itemStockChangeHistory: [
            {
              quantity,
              user: userId,
              changeType,
              changedFrom,
            },
          ],
        });
      } else {
        storeItem.itemQuantityInStore += quantity;
        storeItem.itemShelfDates = [
          ...storeItem.itemShelfDates,
          ...itemShelfDates.map((shelf: { quantityToAdd: number; }) => ({
            ...shelf,
            quantity: shelf.quantityToAdd ?? 0,
          })),
        ];
        storeItem.itemStockChangeHistory.push({
          quantity,
          user: userId,
          changeType,
          changedFrom,
        });
      }
      const updatedItem = await Item.findByIdAndUpdate(
        itemId,
        { $inc: { itemStockQuantity: -quantity } },
        { new: true }
      );
      await storeItem.save();
      updatedItems.push({ storeItem, updatedItem });
    }

    res.status(200).json({
      message: MESSAGES.STORE_UPDATED_SUCCESSFULLY,
      success: true,
      storeItem: updatedItems,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
