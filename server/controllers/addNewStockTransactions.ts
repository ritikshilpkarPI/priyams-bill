import { NextFunction, Request, Response } from 'express';
import { StockTransactionModel } from '../db-models/stock-transaction-model';
import { MESSAGES } from '../constants/messages';
import { CONSTANTS } from '../constants/constants';

export const addNewStockTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    transactionType,
    source,
    destination,
    transactionItems,
    transactionReason,
    dateOfTransaction,
    adminRemark,
    hasErrors = false,
  } = req.body;

  try {
    if (
      !transactionType ||
      ![CONSTANTS.IN, CONSTANTS.OUT].includes(transactionType)
    ) {
      return res
        .status(400)
        .json({
          message: MESSAGES.STOCK_TRANSACTIONS.INVALID_TRANSACTIONS_TYPE,
        });
    }

    if (!source?.sourceStaff || !source?.sourceEntityId) {
      return res
        .status(400)
        .json({ message: MESSAGES.STOCK_TRANSACTIONS.SOURCE_REQUIRED });
    }

    if (!destination?.destinationStaff || !destination?.destinationEntityId) {
      return res
        .status(400)
        .json({ message: MESSAGES.STOCK_TRANSACTIONS.DESTINATION_REQUIRED });
    }

    if (!Array.isArray(transactionItems) || transactionItems.length === 0) {
      return res
        .status(400)
        .json({
          message: MESSAGES.STOCK_TRANSACTIONS.TRANSACTION_ITEMS_REQUIRED,
        });
    }

    const newTransaction = new StockTransactionModel({
      transactionType,
      source,
      destination,
      transactionItems,
      transactionReason,
      dateOfTransaction,
      adminRemark,
      hasErrors,
      transactionStatus: CONSTANTS.STATUS.PENDING,
      approvedByAdmin: false,
    });

    const savedTransaction = await newTransaction.save();

    return res.status(201).json({
      success: true,
      message: MESSAGES.STOCK_TRANSACTIONS.CREATED,
      data: savedTransaction,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
