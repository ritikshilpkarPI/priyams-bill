import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StockTransactionModel } from '../db-models/stock-transaction-model';
import { MESSAGES } from '../constants/messages'; 

export const updateStockTransactionSource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: MESSAGES.BAD_REQUEST });
    }

    const { source, transactionItems } = req.body;

    if (!source && !transactionItems) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.MISSING_REQUIRED_FIELDS,
      });
    }

    const transaction = await StockTransactionModel.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: MESSAGES.NOT_FOUND,
      });
    }

    
    if (source) {
      if (source.sourceStaff !== undefined) transaction.source.sourceStaff = source.sourceStaff;
      if (source.sourceEntityId !== undefined) transaction.source.sourceEntityId = source.sourceEntityId;
      if (source.sourceType !== undefined) transaction.source.sourceType = source.sourceType;
      if (source.sourceRemark !== undefined) transaction.source.sourceRemark = source.sourceRemark;
    }

    
    if (transactionItems && Array.isArray(transactionItems)) {
      transactionItems.forEach((itemUpdate: any) => {
        const targetItem = transaction.transactionItems.find(
          (t) => t.itemId.toString() === itemUpdate.itemId
        );

        if (targetItem && Array.isArray(itemUpdate.itemByDate)) {
          itemUpdate.itemByDate.forEach((dateUpdate: any, index: number) => {
            const existingDateItem = targetItem.itemByDate[index];
            if (existingDateItem) {
              if (dateUpdate.sourceQuantity) {
                existingDateItem.sourceQuantity = {
                  expiryDate: dateUpdate.sourceQuantity.expiryDate || existingDateItem.sourceQuantity.expiryDate,
                  manufacturingDate: dateUpdate.sourceQuantity.manufacturingDate || existingDateItem.sourceQuantity.manufacturingDate,
                  qty: dateUpdate.sourceQuantity.qty ?? existingDateItem.sourceQuantity.qty,
                };
              }

              if (dateUpdate.sourceRemark !== undefined) {
                existingDateItem.sourceRemark = dateUpdate.sourceRemark;
              }

              if (dateUpdate.itemError) {
                existingDateItem.itemError = {
                  errorReason: dateUpdate.itemError.errorReason || 'NONE',
                  errorQty: dateUpdate.itemError.errorQty ?? existingDateItem.itemError?.errorQty,
                  isResolved: dateUpdate.itemError.isResolved ?? existingDateItem.itemError?.isResolved ?? false,
                };
              }
            }
          });
        }
      });
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
