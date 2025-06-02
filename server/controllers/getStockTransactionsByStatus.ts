import { Request, Response } from 'express';
import { CONSTANTS } from '../constants/constants';
import { StockTransactionModel } from '../db-models/stock-transaction-model';

export const getStockTransactionsByStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { status, page = '1', limit = '10' } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const skip = (pageNumber - 1) * limitNumber;
    const filter: any = { isDeleted: false };

    if (status && typeof status === 'string') {
      filter.transactionStatus = status;
    }

    const transactions = await StockTransactionModel.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .populate('transactionItems.itemId')
      .populate({ path: 'source.sourceStaff', select: '-password' })
      .populate({ path: 'destination.destinationStaff', select: '-password' })
      .populate({ path: 'source.sourceEntityId', select: 'name pincode' })
      .populate({
        path: 'destination.destinationEntityId',
        select: 'name pincode',
      });

    const total = await StockTransactionModel.countDocuments(filter);

    return res.json({
      success: true,
      total,
      page: pageNumber,
      limit: limitNumber,
      transactions,
    });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};
