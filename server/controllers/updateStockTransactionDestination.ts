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

    if (destination && transaction.destination) {
      const { destinationStaff, destinationEntityId, destinationType, destinationRemark } = destination;
      if (destinationStaff !== undefined) transaction.destination.destinationStaff = destinationStaff;
      if (destinationEntityId !== undefined) transaction.destination.destinationEntityId = destinationEntityId;
      if (destinationType !== undefined) transaction.destination.destinationType = destinationType;
      if (destinationRemark !== undefined) transaction.destination.destinationRemark = destinationRemark;
    }

    if (Array.isArray(transactionItems)) {
      const transactionItemMap = new Map(
        transaction.transactionItems.map((item) => [item.itemId.toString(), item])
      );

      for (const itemUpdate of transactionItems) {
        const targetItem = transactionItemMap.get(itemUpdate.itemId);
        if (!targetItem || !Array.isArray(itemUpdate.itemByDate)) continue;

        const existingDates = targetItem.itemByDate;

        for (let i = 0; i < itemUpdate.itemByDate.length; i++) {
          const dateUpdate = itemUpdate.itemByDate[i];
          const existingDateItem = existingDates[i];
          if (!existingDateItem) continue;

          if (dateUpdate.destinationQuantity) {
            existingDateItem.destinationQuantity = {
              expiryDate:
                dateUpdate.destinationQuantity.expiryDate ?? existingDateItem.destinationQuantity?.expiryDate,
              manufacturingDate:
                dateUpdate.destinationQuantity.manufacturingDate ?? existingDateItem.destinationQuantity?.manufacturingDate,
              qty:
                dateUpdate.destinationQuantity.qty ?? existingDateItem.destinationQuantity?.qty,
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
