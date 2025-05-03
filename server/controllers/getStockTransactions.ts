import { NextFunction, Request, Response } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import { StockTransactionModel } from '../db-models/stock-transaction-model';
import { MESSAGES } from '../constants/messages';
import { getStoreInventoryModel } from '../db-models/storeInventory-model';
import { StockTransactionFilterBody } from '../types';
import { getValidDateRange } from '../util/getValidDateRange';
import { validateStore } from '../util/validateStore';

const toObjectIds = (ids: string[]) => ids.map(id => new mongoose.Types.ObjectId(id));

export const getStockTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      transactionId ,
      storeId,
      itemId ,
      startDate,
      endDate,
      page = '1',
      limit = '100',
    } = req.body as StockTransactionFilterBody;

    const filter: any = {};
    const pageNumber = Math.max(1, parseInt(page, 10));
    const limitNumber = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * limitNumber;

    let store: any;
    if (storeId) {
      store = await validateStore(storeId);
      filter.$or = [
        { 'source.sourceEntityId': storeId },
        { 'destination.destinationEntityId': storeId }
      ];
    }

    if (transactionId !== undefined) {
      const ids = await validateTransactionIds(transactionId, store ? { $or: filter.$or } : null);
      filter._id = { $in: ids };
    }

    if (itemId !== undefined) {
      const itemObjectIds = await validateItemIds(itemId, store?.code);
      filter.transactionItems = { $elemMatch: { itemId: { $in: itemObjectIds } } };
    }

    const { start, end } = getValidDateRange(startDate, endDate);
    filter.createdAt = { $gte: start, $lte: end };

    const transactions = await StockTransactionModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .populate('transactionItems.itemId')
      .populate({ path: 'source.sourceStaff', select: '-password' })
      .populate({ path: 'destination.destinationStaff', select: '-password' })
      .populate({ path: 'source.sourceEntityId', select: 'name pincode' })
      .populate({ path: 'destination.destinationEntityId', select: 'name pincode' });

    const totalCount = await StockTransactionModel.countDocuments(filter);


    return res.status(200).json({ success: true, data: transactions, totalCount });

  } catch (err) {
    return res.status(400).json({ success: false, err});
  }
};

async function validateTransactionIds(ids: string[], storeFilter: any) {
    if (!Array.isArray(ids)) {
      throw { status: 400, message: MESSAGES.TRANSACTION_ID_MUST_BE_ARRAY };
    }
    const validIds = ids.filter(isValidObjectId);
    if (validIds.length !== ids.length)
      throw { status: 400, message: MESSAGES.INVALID_TRANSACTION_IDS };
  
    const objectIds = toObjectIds(validIds);
    if (!storeFilter) return objectIds;
  
    const matching = await StockTransactionModel.find({
      _id: { $in: objectIds },
      ...storeFilter,
    }).select('_id');
  
    const matchedIds = new Set(matching.map((t) => t._id.toString()));
    const invalid = ids.filter((id) => !matchedIds.has(id));
    if (invalid.length)
      throw {
        status: 404,
        message: MESSAGES.TRANSACTIONS_NOT_LINKED_TO_STORE,
        invalidTransactionIds: invalid,
      };
  
    return objectIds;
  }
  
  
  
async function validateItemIds(itemIds: string[], storeCode?: string) {
    if (!Array.isArray(itemIds)) {
          throw { status: 400, message: MESSAGES.ITEM_ID_MUST_BE_ARRAY };
        }
    const validIds = itemIds.filter(isValidObjectId);
    if (validIds.length !== itemIds.length) throw { status: 400, message: MESSAGES.INVALID_ITEM_IDS };
    if (!storeCode) return toObjectIds(validIds);
  
    const inventoryModel = getStoreInventoryModel(storeCode.toLowerCase());
    const items = await inventoryModel.find({ itemId: { $in: toObjectIds(validIds) } }).select('itemId');
    const itemSet = new Set(items.map(i => i.itemId.toString()));
    const invalid = validIds.filter(id => !itemSet.has(id));
    if (invalid.length) throw { status: 404, message: MESSAGES.ITEMS_NOT_IN_STORE_INVENTORY, invalidItemIds: invalid };
  
    return toObjectIds(validIds);
  }
