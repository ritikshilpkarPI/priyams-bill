import { Request, Response } from 'express';
import { getStoreInventoryModel } from '../db-models/storeInventory-model';
import { StoreModel } from '../db-models/store-model';
import { MESSAGES } from '../constants/messages';
import { CONSTANTS } from '../constants/constants';

export const getItemsFromStoreInventory = async (
  req: Request,
  res: Response
) => {
  try {
    const storeId = req.params.storeId;
    const store = await StoreModel.findById(storeId);
    if (!store) {
      return res.status(404).json({ error: MESSAGES.STORE_NOT_FOUND });
    }
    const StoreInventoryModel = getStoreInventoryModel(store.collectionName);
    const { page = 1, size = 100 } = req.query;
    const limit = Number(size);
    const skip = (Number(page) - 1) * limit;
    const inventoryData = await StoreInventoryModel
      .find()
      .select('itemId itemQuantityInStore')
      .populate('itemId', CONSTANTS.STATIC_FIELDS_TO_SELECT + ' sku')
      .limit(limit)
      .skip(skip)
      .lean();

    const totalItems = await StoreInventoryModel.countDocuments();
    const items = inventoryData.map((data:any)=>({
      ...data.itemId,
      itemQuantityInStore: data.itemQuantityInStore
    }));
    return res.status(200).json({ data: items, count: totalItems });
  } catch (error) {
    res.status(400).json({ error });
  }
};
