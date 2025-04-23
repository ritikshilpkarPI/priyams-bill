import { Request, Response, NextFunction } from 'express';
import { StockTransactionModel } from '../db-models/stock-transaction-model';
import { MESSAGES } from '../constants/messages';
import { CONSTANTS } from '../constants/constants';
import { v4 as uuidv4 } from 'uuid'; 

export const updateItemMismatchInStock = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { storeId, staffId, item } = req.body;

    if (!storeId || !staffId || !item || typeof item !== 'object') {
      return res
        .status(400)
        .json({ message: MESSAGES.MISSING_REQUIRED_FIELDS });
    }

    const { itemId, currentCount, updateCount, expiryDate, manufacturingDate } =
      item;


    const source = {
      sourceStaff: staffId,
      sourceEntityId: storeId,
      sourceType: CONSTANTS.STORE,
    };

    const destination = {
      destinationStaff: staffId,
      destinationEntityId: storeId,
      destinationType: CONSTANTS.STORE,
    };

    const itemByDate = [
      {
        sourceQuantity: {
          expiryDate,
          manufacturingDate,
          qty:
            currentCount > updateCount
              ? Math.abs(currentCount - updateCount)
              : 0,
        },
        destinationQuantity: {
          expiryDate,
          manufacturingDate,
          qty:
            updateCount > currentCount
              ? Math.abs(updateCount - currentCount)
              : 0,
        },
      },
    ];

    const existingTransaction = await StockTransactionModel.findOne({
      transactionReason: CONSTANTS.QUANTITY_UPDATE,
      transactionStatus: CONSTANTS.STATUS.PENDING,
      'transactionItems.itemId': itemId,
      'source.sourceEntityId': storeId,
    });

    let transaction;

    if (existingTransaction) {
      (existingTransaction.transactionType =
        currentCount > updateCount ? CONSTANTS.OUT : CONSTANTS.IN),
        (existingTransaction.transactionItems = [
          {
            itemId,
            itemByDate,
          },
        ]);
      existingTransaction.dateOfTransaction = new Date();
      transaction = await existingTransaction.save();
    } else {
      const newTransaction = {
        transactionType:
          currentCount > updateCount ? CONSTANTS.OUT : CONSTANTS.IN,
        source,
        destination,
        transactionItems: [
          {
            itemId,
            itemByDate,
          },
        ],
        transactionReason: CONSTANTS.QUANTITY_UPDATE,
        transactionStatus: CONSTANTS.STATUS.PENDING,
        dateOfTransaction: new Date(),
      };

      transaction = await StockTransactionModel.create(newTransaction);
    }

    return res.status(201).json({
      message: MESSAGES.MISMATCH_TRANSACTION_CREATED,
      data: transaction,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
