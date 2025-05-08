import { Request, Response } from 'express';
import { StockTransactionModel } from '../db-models/stock-transaction-model';
import { MESSAGES } from '../constants/messages';
import mongoose from 'mongoose';

export const bulkApproveStockTransactions = async (req: Request, res: Response) => {
  try {
    const { transactionIds = [], adminRemark = '' } = req.body;

    if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: MESSAGES.MISSING_REQUIRED_FIELDS,
      });
    }

    const validIds = transactionIds.filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid transaction IDs provided.',
      });
    }

    const result = await StockTransactionModel.updateMany(
      {
        _id: { $in: validIds },
        hasErrors: false,
      },
      {
        $set: {
          approvedByAdmin: true,
          adminRemark,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: `Bulk approval complete. ${result.modifiedCount} transaction(s) updated.`,
    });

  } catch (error) {
    console.error('Bulk approval failed:', error);
    return res.status(500).json({
      success: false,
      message: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};
