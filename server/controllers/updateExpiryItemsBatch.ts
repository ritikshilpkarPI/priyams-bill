import { store } from './../../src/redux/store';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import expiredItemsBatch from '../db-models/expired-items-batch-model';
import {
  ExpiredItemsSchema,
  ItemWiseTotalCostType,
  StatusHistory,
} from '../types';
import { expiredStatus } from '../util/constants/expiredItemsConstant';
import { CONSTANTS } from '../constants/constants';
import { convertItemsToTransactionItems } from '../util/convertItemsToTransactionItems';
import { StockTransactionModel } from '../db-models/stock-transaction-model';
import { updateSource } from '../util/updateSource';
import { StoreModel } from '../db-models/store-model';

export const updateExpiryItemsBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      expiryBatchCost,
      status,
      items,
      itemWiseTotalCost,
      remark,
      deviceInfo,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid batch ID' });
    }
    
    const updatePayload: Partial<ExpiredItemsSchema> = {};
    if (expiryBatchCost !== undefined) {
      if (isNaN(Number(expiryBatchCost))) {
        return res.status(400).json({ message: 'Invalid expiryBatchCost' });
      }
      updatePayload.expiryBatchCost = Number(expiryBatchCost);
    }

    if (status !== undefined) {
      if (!Object.values(expiredStatus).includes(status)) {
        return res.status(400).json({ message: 'Invalid Status' });
      }
      updatePayload.status = status;
    }

    if (items !== undefined) {
      if (!Array.isArray(items)) {
        return res.status(400).json({ message: 'Invalid items format' });
      }
      updatePayload.items = items;
    }

    if (itemWiseTotalCost !== undefined) {
      if (!Array.isArray(itemWiseTotalCost)) {
        return res
          .status(400)
          .json({ message: 'Invalid itemWiseTotalCost format' });
      }
      updatePayload.itemWiseTotalCost =
        itemWiseTotalCost as ItemWiseTotalCostType[];
    }

    const newStatus: StatusHistory = {
      dateTime: new Date(),
      ipReferrer: req.headers.referer || '',
      status: status,
      staffId: (req as any)?.user?._id,
      statusChangeRemark: remark || '',
      browser: deviceInfo?.browser || 'Unknown',
      os: deviceInfo?.os || 'Unknown',
    };

    let updatedBatch;

    if (status === CONSTANTS.EXPIRED_STATUS.APPROVED) {
      const store = await StoreModel.findOne({
        collectionName: CONSTANTS.WAREHOUSE_COLLECTION_NAME,
      });

      const storeId = store?._id?.toString();

      if (!storeId) {
        return res.status(404).json({ message: 'Store not found' });
      }

      const expiredBatch = await expiredItemsBatch
        .findById(id)
        .populate('items.itemId');

      if (!expiredBatch) {
        return res.status(404).json({ message: 'Batch not found' });
      }

      const source = {
        sourceStaff: (req as any)?.user?._id,
        sourceEntityId: storeId,
        sourceType: CONSTANTS.WAREHOUSE,
      };
      const destination = {
        destinationStaff: (req as any)?.user?._id,
        destinationEntityId: storeId,
        destinationType: CONSTANTS.WAREHOUSE,
      };
      const transactionItems = convertItemsToTransactionItems(
        expiredBatch.items || []
      );

      const transaction = await StockTransactionModel.create({
        transactionType: CONSTANTS.OUT,
        source,
        destination,
        transactionItems,
        transactionStatus: CONSTANTS.TRANSACTIONS_STATUS.SOURCE_CREATED,
        transactionReason: CONSTANTS.TRANSACTION_REASON.EXPIRED_BATCH,
        dateOfTransaction: new Date(),
      });

      if (!transaction?._id) {
        throw new Error('Failed to create stock transaction');
      }
      const itemsToTransfer = [];

      for (const txnItem of transaction.transactionItems || []) {
        const totalQty = txnItem.itemByDate?.reduce(
          (sum: number, entry: any) => sum + (entry.sourceQuantity?.qty || 0),
          0
        );

        if (totalQty && txnItem.itemId) {
          itemsToTransfer.push({
            itemId: txnItem.itemId,
            quantity: totalQty,
            itemShelfDates: txnItem.itemByDate?.map((entry: any) => ({
              expiryDate: entry.sourceQuantity?.expiryDate,
              manufacturingDate: entry.sourceQuantity?.manufacturingDate,
              quantityToAdd: entry.sourceQuantity?.qty,
              initialStockQuantity: entry.sourceQuantity?.qty,
              currentStockQuantity: entry.sourceQuantity?.qty,
            })),
          });
        }
      }
      await updateSource({
        userId: (req as any)?.user?._id,
        items: itemsToTransfer,
        sourceType: CONSTANTS.WAREHOUSE,
        sourceEntityId: storeId,
        transactionId: transaction._id.toString(),
      });

      transaction.transactionStatus = CONSTANTS.STATUS.APPROVED;
      transaction.approvedByAdmin = true
      await transaction.save();

      updatedBatch = await expiredItemsBatch.findByIdAndUpdate(
        id,
        { $set: updatePayload, $push: { statusHistory: newStatus } },
        { new: true }
      );
    } else {
      updatedBatch = await expiredItemsBatch.findByIdAndUpdate(
        id,
        { $set: updatePayload, $push: { statusHistory: newStatus } },
        { new: true }
      );
    }

    if (!updatedBatch) {
      return res.status(404).json({ message: 'Expired items batch not found' });
    }

    return res.status(200).json({
      message: 'Expired items batch updated successfully',
      data: updatedBatch,
    });
  } catch (error) {
    console.error('Error updating expired items batch:', error);
    return next(error);
  }
};
