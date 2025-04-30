import { NextFunction, Request, Response } from 'express';
import { StockTransactionModel } from '../db-models/stock-transaction-model';
import mongoose, { RootFilterQuery } from 'mongoose';
import { StockTransactionType } from '../types';

export const getItemTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { itemIds, storeIds, limit = 10, page = 1 } = req.body;

    if (!itemIds) {
      return res.status(400).json({ error: 'itemIds is required' });
    }

    const itemIdArray = itemIds
      .map((id: string) => new mongoose.Types.ObjectId(id));
    const storeIdArray = storeIds
      ? storeIds
          .map((id: string) => new mongoose.Types.ObjectId(id))
      : [];

    const filter: RootFilterQuery<StockTransactionType> = {};

    if(itemIdArray.length) {
        filter.transactionItems = { $elemMatch: { itemId: { $in: itemIdArray } } };
    };

    if (storeIdArray.length) {
        filter.$or = [
        { 'source.sourceEntityId': { $in: storeIdArray } },
        { 'destination.destinationEntityId': { $in: storeIdArray } },
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10));
    const limitNumber = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * limitNumber;

    let transactions = await StockTransactionModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .populate('transactionItems.itemId')
      .populate({ path: 'source.sourceStaff', select: '-password' })
      .populate({ path: 'destination.destinationStaff', select: '-password' })
      .lean();

    const totalCount = await StockTransactionModel.countDocuments(filter);


    const itemIdSet = new Set(itemIdArray.map((id: mongoose.Types.ObjectId) => id.toString()));

    transactions.forEach(tx => {
        tx.transactionItems = tx.transactionItems.filter(item =>
            item.itemId && itemIdSet.has(item.itemId._id?.toString())
        );
    });

    res.status(200).json({ success: true, data: transactions, totalCount });
  } catch (error) {
    console.error('Error filtering transactions:', error);
    next(error)
  }
};
