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

    const inventoryData = await StoreInventoryModel.find().populate(
      'itemId',
      CONSTANTS.STATIC_FIELDS_TO_SELECT
    );
    return res.status(200).json({ data: inventoryData });
  } catch (error) {
    res.status(400).json({ error });
  }
};
