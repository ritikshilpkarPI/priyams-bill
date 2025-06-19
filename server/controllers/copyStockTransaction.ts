import { NextFunction, Request, Response } from "express";
import { StockTransactionModel } from '../db-models/stock-transaction-model';
import { MESSAGES } from '../constants/messages';
import { CONSTANTS } from '../constants/constants';
import { generateRandomKey } from '../../src/utils/generateRandomKey';

export const copyStockTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const originalTransaction = await StockTransactionModel.findById(id).lean();
    if (!originalTransaction) {
      return res.status(404).json({
        message: MESSAGES.STOCK_TRANSACTIONS.TRANSACTION_NOT_FOUND,
        success: false
      });
    }

    const newTransaction = {
      transactionType: originalTransaction.transactionType,
      source: originalTransaction.source,
      destination: originalTransaction.destination,
      transactionReason: originalTransaction.transactionReason,
      dateOfTransaction: new Date(),
      transactionStatus: CONSTANTS.STATUS.PENDING,
      hasErrors: false,
      approvedByAdmin: false,
      adminRemark: '',
      isDeleted: false,
      transactionItems: originalTransaction.transactionItems.map(item => ({
        ...item,
        itemByDate: item.itemByDate.map(dateItem => ({
          ...dateItem,
          destinationQuantity: {
            expiryDate: undefined,
            manufacturingDate: undefined,
            qty: 0
          },
          destinationRemark: undefined,
          itemError: {
            errorReason: 'NONE',
            errorQty: 0,
            isResolved: true
          }
        }))
      })),
      transactionSlug: `${Date.now()}${generateRandomKey(4)}`
    };

    const copiedTransaction = await StockTransactionModel.create(newTransaction);

    res.status(201).json({
      message: MESSAGES.STOCK_TRANSACTIONS.COPIED_SUCCESS,
      success: true,
      transaction: copiedTransaction
    });
  } catch (error) {
    next(error);
  }
}; 