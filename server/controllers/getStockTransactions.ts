import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { StockTransactionModel } from '../db-models/stock-transaction-model';
import { MESSAGES } from '../constants/messages';
import { StoreModel } from '../db-models/store-model';
import { getStoreInventoryModel } from '../db-models/storeInventory-model';

export const getStockTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      transactionId,
      storeId,
      itemId,
      startDate,
      endDate,
      page = '1',
      limit = '100',
    } = req.body;
    const filter: Record<string, any> = {};

    const pageNumber = Math.max(1, parseInt(page, 10)),
      limitNumber = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * limitNumber;

    let validTransactionIds: string[] = [];

    if (transactionId) {
      validTransactionIds = (
        Array.isArray(transactionId) ? transactionId : []
      ).filter((id) => mongoose.Types.ObjectId.isValid(id));
      if (validTransactionIds.length !== (transactionId || []).length)
        return res
          .status(400)
          .json({ success: false, message: MESSAGES.INVALID_TRANSACTION_IDS });
      filter._id = {
        $in: validTransactionIds.map((id) => new mongoose.Types.ObjectId(id)),
      };
    }

    if (storeId) {
      if (!mongoose.Types.ObjectId.isValid(storeId))
        return res
          .status(400)
          .json({ success: false, message: MESSAGES.INVALID_STORE_ID });
      const store = await StoreModel.findById(storeId);
      
      if (!store)
        return res
          .status(404)
          .json({ success: false, message: MESSAGES.STORE_NOT_FOUND_FOR_TRANSACTIONS  });

      filter.$or = [
        { 'source.sourceEntityId': storeId },
        { 'destination.destinationEntityId': storeId },
      ];
      if (validTransactionIds.length) {
        const relatedTransactions = await StockTransactionModel.find({
          _id: { $in: filter._id.$in },
          $or: filter.$or,
        }).select('_id');
        const invalidTransactionIds = validTransactionIds.filter(
          (id) => !relatedTransactions.some((t) => t._id.toString() === id)
        );
        if (invalidTransactionIds.length)
          return res
            .status(404)
            .json({
              success: false,
              message: MESSAGES.TRANSACTIONS_NOT_LINKED_TO_STORE,
              invalidTransactionIds,
            });
      }
    }

    if (itemId) {
      const validItemIds = (Array.isArray(itemId) ? itemId : []).filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      if (validItemIds.length !== (itemId || []).length)
        return res
          .status(400)
          .json({ success: false,  message:MESSAGES.INVALID_ITEM_IDS  });

      if (storeId) {
        const storeDoc = await StoreModel.findById(storeId);
        if (storeDoc) {
          const inventoryItems = await getStoreInventoryModel(
            storeDoc.code.toLowerCase()
          )
            .find({
              itemId: {
                $in: validItemIds.map((id) => new mongoose.Types.ObjectId(id)),
              },
            })
            .select('itemId');
          const inventoryItemIds = inventoryItems.map((doc) =>
            doc.itemId.toString()
          );
          const invalidItemIds = validItemIds.filter(
            (id) => !inventoryItemIds.includes(id)
          );
          if (invalidItemIds.length)
            return res
              .status(404)
              .json({
                success: false,
                message: MESSAGES.ITEMS_NOT_IN_STORE_INVENTORY,
                invalidItemIds,
              });
        }
      }
      filter.transactionItems = {
        $elemMatch: {
          itemId: {
            $in: validItemIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        },
      };
    }

    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start)
      return res
        .status(400)
        .json({ success: false, message:MESSAGES.INVALID_DATE_RANGE  });

    filter.createdAt = { $gte: start, $lte: end };

    const transactions = await StockTransactionModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .populate('transactionItems.itemId')
      .populate({ path: 'source.sourceStaff', select: '-password' })
      .populate({ path: 'destination.destinationStaff', select: '-password' });

    const totalCount = await StockTransactionModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: transactions,
      totalCount
    });
  } catch (error) {
    next(error);
  }
};
