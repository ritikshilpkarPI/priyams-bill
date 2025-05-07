import { isValidObjectId } from 'mongoose';
import { StoreModel } from '../db-models/store-model';
import { MESSAGES } from '../constants/messages';

export const validateStore = async (storeId: string) => {
  if (!isValidObjectId(storeId))
    throw { status: 400, message: MESSAGES.INVALID_STORE_ID };
  const store = await StoreModel.findById(storeId);
  if (!store)
    throw { status: 400, message: MESSAGES.STORE_NOT_FOUND_FOR_TRANSACTIONS };
  return store;
};
