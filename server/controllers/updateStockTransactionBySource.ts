import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StockTransactionModel } from '../db-models/stock-transaction-model';
import { MESSAGES } from '../constants/messages';

export const updateStockTransactionBySource = async (req: Request, res: Response) => {
  try {
    const { transactionId, itemByDate: { transactionItems }, source } = req.body;

    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ success: false, message: MESSAGES.BAD_REQUEST });
    }

    const transaction = await StockTransactionModel.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: MESSAGES.NOT_FOUND,
      });
    }

    if (source && transaction.source) {
      const { sourceStaff, sourceEntityId, sourceType, sourceRemark } = source;
      if (sourceStaff !== undefined) transaction.source.sourceStaff = sourceStaff;
      if (sourceEntityId !== undefined) transaction.source.sourceEntityId = sourceEntityId;
      if (sourceType !== undefined) transaction.source.sourceType = sourceType;
      if (sourceRemark !== undefined) transaction.source.sourceRemark = sourceRemark;
    }

    if (Array.isArray(transactionItems)) {
      for (const itemUpdate of transactionItems) {
        const itemIdStr = itemUpdate.itemId?._id?.toString();
        if (!itemIdStr) continue;

        const transactionItem = transaction.transactionItems.find(
          (item) => item.itemId.toString() === itemIdStr
        );
        if (!transactionItem || !Array.isArray(itemUpdate.itemByDate)) continue;

        for (let i = 0; i < itemUpdate.itemByDate.length; i++) {
          const update = itemUpdate.itemByDate[i];
          const existing = transactionItem.itemByDate[i];
          if (!existing) continue;

          if (update.sourceQuantity) {
            existing.sourceQuantity = {
              expiryDate: update.sourceQuantity.expiryDate ?? existing.sourceQuantity?.expiryDate,
              manufacturingDate: update.sourceQuantity.manufacturingDate ?? existing.sourceQuantity?.manufacturingDate,
              qty: update.sourceQuantity.qty ?? existing.sourceQuantity?.qty,
            };
          }

          if (update.sourceRemark !== undefined) {
            existing.sourceRemark = update.sourceRemark;
          }

          if (update.source.qty !== existing.sourceQuantity?.qty) {
            existing.itemError = {
              errorReason: 'Source quantity mismatch',
              errorQty: update.source.qty,
              isResolved: false,
            };
          }
        }
      }
    }

    await transaction.save();

    return res.status(200).json({
      success: true,
      message: MESSAGES.ORDER_UPDATED_SUCCESSFULLY,
      transaction,
    });
  } catch (error) {
    console.error('Error updating stock transaction source:', error);
    return res.status(500).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};
