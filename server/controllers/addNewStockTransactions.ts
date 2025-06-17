import { Request, Response, NextFunction } from 'express';
import { StockTransactionModel } from '../db-models/stock-transaction-model';
import { MESSAGES } from '../constants/messages';
import { CONSTANTS } from '../constants/constants';
import { TransactionItemByDate, StockTransactionType, TransactionItem, StockTransactionsInterface } from '../types';
import { generateRandomKey } from '../../src/utils/generateRandomKey';
import { StoreModel } from '../db-models/store-model';
import { getStoreInventoryModel } from '../db-models/storeInventory-model';
import mongoose from 'mongoose';

export const addNewStockTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {transactions}: StockTransactionsInterface = req.body;  

  if (!Array.isArray(transactions) || transactions.length === 0) {
    return res.status(400).json({
      message: MESSAGES.STOCK_TRANSACTIONS.TRANSACTIONS_REQUIRED,
    });
  }

  const validTransactionTypes: string[] = [CONSTANTS.IN, CONSTANTS.OUT];
  const transactionsToInsert = [];

  for (const transaction of transactions) {
    const {
      transactionType,
      source,
      destination,
      transactionItems,
      transactionReason,
      dateOfTransaction,
      adminRemark,
      hasErrors = false,
    }:StockTransactionType = transaction;

    if (!transactionType || !validTransactionTypes.includes(transactionType)) {
      return res.status(400).json({
        message: MESSAGES.STOCK_TRANSACTIONS.INVALID_TRANSACTIONS_TYPE,
      });
    }

    if (!source?.sourceStaff || !source?.sourceEntityId) {
      return res.status(400).json({
        message: MESSAGES.STOCK_TRANSACTIONS.SOURCE_REQUIRED,
      });
    }

    if (!Array.isArray(transactionItems) || transactionItems.length === 0) {
      return res.status(400).json({
        message: MESSAGES.STOCK_TRANSACTIONS.TRANSACTION_ITEMS_REQUIRED,
      });
    }

    let destinationStoreItems = new Map();
    if (destination?.destinationEntityId && destination?.destinationType === CONSTANTS.STORE) {
      const store = await StoreModel.findById(destination.destinationEntityId);
      if (store) {
        const StoreInventory = getStoreInventoryModel(store.collectionName);
        const itemIds = transactionItems.map(item => new mongoose.Types.ObjectId(item.itemId));
        const existingItems = await StoreInventory.find({ itemId: { $in: itemIds } });
        destinationStoreItems = new Map(
          existingItems.map(item => [item.itemId.toString(), item])
        );
      }
    }

    const filteredTransactionItems = transactionItems
      .map((item: TransactionItem) => {
        const validItemByDate = (item.itemByDate || []).filter(
          (entry: TransactionItemByDate) => {
            const sourceQty = entry?.sourceQuantity?.qty || 0;
            const destinationQty = entry?.destinationQuantity?.qty || 0;
            return sourceQty > 0 || destinationQty > 0;
          }
        );

        if (validItemByDate.length === 0) return null;

        const isNew = !destinationStoreItems.has(item.itemId.toString());

        return {
          ...item,
          itemByDate: validItemByDate,
          isNew
        };
      })
      .filter(Boolean);

    if (filteredTransactionItems.length === 0) {
      return res.status(400).json({
        message: MESSAGES.STOCK_TRANSACTIONS.TRANSACTION_ITEMS_REQUIRED,
      });
    }

    const cleanDestination = {
      ...destination,
    };
    
    if (!cleanDestination.destinationStaff) {
      delete cleanDestination.destinationStaff;
    }
    if (!cleanDestination.destinationEntityId) {
      delete cleanDestination.destinationEntityId;
    }

    transactionsToInsert.push({
      transactionType,
      source,
      destination: cleanDestination,
      transactionItems: filteredTransactionItems,
      transactionReason,
      dateOfTransaction,
      adminRemark,
      hasErrors,
      transactionStatus: CONSTANTS.TRANSACTIONS_STATUS.SOURCE_CREATED,
      approvedByAdmin: false,
      transactionSlug: `${Date.now()}${generateRandomKey(4)}`,
    });
  }

  try {

    const insertedTransactions = await StockTransactionModel.insertMany(transactionsToInsert);

    return res.status(201).json({
      success: true,
      message: MESSAGES.STOCK_TRANSACTIONS.CREATED,
      data: insertedTransactions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};
