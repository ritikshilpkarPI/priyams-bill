import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StockTransactionModel } from '../db-models/stock-transaction-model';
import { MESSAGES } from '../constants/messages';

export const updateStockTransactionDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: MESSAGES.BAD_REQUEST });
    }

    const { destination, transactionItems } = req.body;

    if (!destination && !transactionItems) {
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

    if (destination) {
      if (destination.destinationStaff !== undefined) {
        if (transaction.destination) {
          transaction.destination.destinationStaff = destination.destinationStaff;
        }
      }
      if (destination.destinationEntityId !== undefined) {
        if (transaction.destination) {
          transaction.destination.destinationEntityId = destination.destinationEntityId;
        }
      }
      if (destination.destinationType !== undefined) {
        if (transaction.destination) {
          transaction.destination.destinationType = destination.destinationType;
        }
      }
      if (destination.destinationRemark !== undefined) {
        if (transaction.destination) {
          transaction.destination.destinationRemark = destination.destinationRemark;
        }
      }
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
              if (dateUpdate.destinationQuantity) {
                existingDateItem.destinationQuantity = {
                  expiryDate: dateUpdate.destinationQuantity.expiryDate || existingDateItem.destinationQuantity?.expiryDate,
                  manufacturingDate: dateUpdate.destinationQuantity.manufacturingDate || existingDateItem.destinationQuantity?.manufacturingDate,
                  qty: dateUpdate.destinationQuantity.qty ?? existingDateItem.destinationQuantity?.qty,
                };
              }

              if (dateUpdate.destinationRemark !== undefined) {
                existingDateItem.destinationRemark = dateUpdate.destinationRemark;
              }

              if (dateUpdate.itemError) {
                existingDateItem.itemError = {
                  errorReason: dateUpdate.itemError.errorReason ?? existingDateItem.itemError?.errorReason ?? 'NONE',
                  errorQty: dateUpdate.itemError.errorQty ?? existingDateItem.itemError?.errorQty ?? 0,
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
    console.error('Error updating stock transaction destination:', error);
    return res.status(500).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};
