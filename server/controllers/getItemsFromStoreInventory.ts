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
    const { page = 1, size = 100, itemNameOrBarcode } = req.query;
    const limit = Number(size);
    const skip = (Number(page) - 1) * limit;
    let query = {};
    if (itemNameOrBarcode) {
      const barcode = itemNameOrBarcode.toString();
      const nameRegex = new RegExp(barcode, 'i');
      query = {
         $or: [{ itemBarcode: barcode }, { itemName: nameRegex }],
        }
    }
    const inventoryData = await StoreInventoryModel
      .find()
      .select('itemId itemQuantityInStore itemShelfDates')
      .populate({
        path: 'itemId',
        select: CONSTANTS.STATIC_FIELDS_TO_SELECT + ' sku',
        match: query
      })
      .limit(limit)
      .skip(skip)
      .lean();

    const filteredData = inventoryData.filter((data: any) => data.itemId);
    
    const totalItems = await StoreInventoryModel.countDocuments(query);

    const items = filteredData.map((data:any) => ({
      ...data.itemId,
      itemQuantityInStore: data.itemQuantityInStore,
      itemShelfDates: data.itemShelfDates
    }));
    return res.status(200).json({  success: true, data: items, count: totalItems });
  } catch (error) {
    res.status(400).json({ error });
  }
};
