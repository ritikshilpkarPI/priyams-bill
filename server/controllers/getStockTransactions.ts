import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { StockTransactionModel } from "../db-models/stock-transaction-model";
import { MESSAGES } from "../constants/messages";

export const getStockTransactions = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const { transactionId, storeId } = req.query;
    const filter: Record<string, any> = {};

    if (transactionId && mongoose.Types.ObjectId.isValid(transactionId as string)) {
      filter._id = transactionId;
    }

    if (storeId && mongoose.Types.ObjectId.isValid(storeId as string)) {
        const storeObjectId = new mongoose.Types.ObjectId(storeId as string);
  
        filter.$or = [
          { "source.sourceEntityId": storeObjectId },
          { "destination.destinationEntityId": storeObjectId }
        ];
    } else if (storeId) {
        return res.status(400).json({ success: false, message: MESSAGES.INVALID_STORE_ID });
    }

    const transactions = await StockTransactionModel.find(filter)
      .populate("transactionItems.itemId")
      .populate({ path: "source.sourceStaff", select: "-password" })
      .populate({ path: "destination.destinationStaff", select: "-password" });

    return res.status(200).json({ success: true, data: transactions });

  } catch (error) {
    next(error)
  }
};
