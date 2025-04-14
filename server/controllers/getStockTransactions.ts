import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { StockTransactionModel } from "../db-models/stock-transaction-model";
import { StoreModel } from "../db-models/store-model";
import { MESSAGES } from "../constants/messages";

export const getStockTransactions = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const { transactionId, pincode } = req.query;
    const filter: Record<string, any> = {};

    if (transactionId && mongoose.Types.ObjectId.isValid(transactionId as string)) {
      filter._id = transactionId;
    }

    if (pincode) {
      const store = await StoreModel.findOne({ pincode });
      if (!store) {
        return res.status(400).json({ success: false, message: MESSAGES.STORE_NOT_FOUND_FOR_GIVEN_PINCODE});
      }

      filter.$or = [
        { "source.sourceEntityId": store._id },
        { "destination.destinationEntityId": store._id }
      ];
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
