import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StockTransactionModel } from '../db-models/stock-transaction-model';
import { MESSAGES } from '../constants/messages';

export const updateStockTransactionDestination = async (req: Request, res: Response) => {
  try {
    const { transactionId, itemByDate: {transactionItems}, destination } = req.body;

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

    if (destination && transaction.destination) {
      const { destinationStaff, destinationEntityId, destinationType, destinationRemark } = destination;
      if (destinationStaff !== undefined) transaction.destination.destinationStaff = destinationStaff;
      if (destinationEntityId !== undefined) transaction.destination.destinationEntityId = destinationEntityId;
      if (destinationType !== undefined) transaction.destination.destinationType = destinationType;
      if (destinationRemark !== undefined) transaction.destination.destinationRemark = destinationRemark;
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

          if (update.destinationQuantity) {
            existing.destinationQuantity = {
              expiryDate: update.destinationQuantity.expiryDate ?? existing.destinationQuantity?.expiryDate,
              manufacturingDate: update.destinationQuantity.manufacturingDate ?? existing.destinationQuantity?.manufacturingDate,
              qty: update.destinationQuantity.qty ?? existing.destinationQuantity?.qty,
            };
          }

          if (update.destinationRemark !== undefined) {
            existing.destinationRemark = update.destinationRemark;
          }

          if (update.destination.qty !== existing.destinationQuantity?.qty) {
            existing.itemError = {
              errorReason: 'Destination quantity mismatch',
              errorQty: update.destination.qty,
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
    console.error('Error updating stock transaction destination:', error);
    return res.status(500).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};
