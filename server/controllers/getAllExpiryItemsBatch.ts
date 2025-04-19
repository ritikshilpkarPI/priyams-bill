import { Request, Response } from 'express';
import expiredItemsModel from '../db-models/expired-items-model';

export const getAllExpiryItemsBatch = async (req: Request, res: Response) => {
  try {
    const expiredItems = await expiredItemsModel.find()
      .populate('dealerId')
      .populate('stockTransactionId')
      .populate('clearanceDetails.clearancePurchaseOrderId')
      .populate('clearanceDetails.dealerId')
      .populate('items.itemId')
      .populate('items.purchaseOrderId')
      .populate('itemWiseTotalCost.itemId')
      .sort({ createdAt: -1 }); 

    res.status(200).json({
      success: true,
      data: expiredItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error
    });
  }
};
