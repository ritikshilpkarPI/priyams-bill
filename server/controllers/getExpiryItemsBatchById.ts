import { Request, Response } from 'express';
import expiredItemsModel from '../db-models/expired-items-model';
import { MESSAGES } from '../constants/messages';

export const getExpiryItemsBatchById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const expiredItemBatch = await expiredItemsModel.findById(id)
      .populate('dealerId')
      .populate('stockTransactionId')
      .populate('clearanceDetails.clearancePurchaseOrderId')
      .populate('clearanceDetails.dealerId')
      .populate('items.itemId')
      .populate('items.purchaseOrderId')
      .populate('itemWiseTotalCost.itemId');

    if (!expiredItemBatch) {
      return res.status(404).json({ success: false, message: MESSAGES.EXPIRED_ITEMS_BATCH_NOT_FOUND });
    }

    res.status(200).json({
      success: true,
      data: expiredItemBatch,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error
    });
  }
};
