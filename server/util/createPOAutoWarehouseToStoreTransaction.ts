import { createWarehouseToStoreDeficiencyTransaction } from './createWarehouseToStoreDeficiencyTransaction';
import { StoreModel } from '../db-models/store-model';
import mongoose from 'mongoose';
import { CONSTANTS } from '../constants/constants';
import { CreatePOAutoWarehouseToStoreTransactionParams } from 'server/types';



export async function createPOAutoWarehouseToStoreTransaction({
  storeId = CONSTANTS.STORE_COLLECTION_NAME,
  staffId,
  newItems,
}: CreatePOAutoWarehouseToStoreTransactionParams) {
  if (!newItems || newItems.length === 0) return null;

  let resolvedStoreId = storeId;
  if (!mongoose.Types.ObjectId.isValid(storeId)) {
    const storeDoc = await StoreModel.findOne({ collectionName: storeId });
    if (!storeDoc) throw new Error('Store not found for code: ' + storeId);
    resolvedStoreId = (storeDoc as any)._id.toString();
  }
  
  const items = newItems.map(item => ({
    itemId: item.itemId,
    deficiencyQty: item.poQty <= 5 ? item.poQty : 5,
  }));

  return await createWarehouseToStoreDeficiencyTransaction({
    storeId: resolvedStoreId,
    staffId,
    items,
  });
} 