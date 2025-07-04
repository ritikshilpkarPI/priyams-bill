import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
const PurchaseOrder = require('../db-models/purchase-order-model');
import ExpiredItemsBatch from '../db-models/expired-items-batch-model';
import { MESSAGES } from '../constants/messages';

export const addExpiryBatchToPO = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { purchaseOrderId, expiryBatchId } = req.body;
    if (!purchaseOrderId || !expiryBatchId) {
      return res.status(400).json({ success: false, message: MESSAGES.PURCHASE_ORDER_ID_AND_EXPIRY_BATCH_ID_REQUIRED });
    }

    const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);
    if (!purchaseOrder) {
      return res.status(404).json({ success: false, message: MESSAGES.PURCHASE_ORDER_NOT_FOUND });
    }

    const expiryBatch = await ExpiredItemsBatch.findById(expiryBatchId).populate('items.itemId');
    if (!expiryBatch) {
      return res.status(404).json({ success: false, message: MESSAGES.EXPIRED_ITEMS_BATCH_NOT_FOUND });
    }

    if (!purchaseOrder.expiryBatches) purchaseOrder.expiryBatches = [];
    const batchIdStr = expiryBatchId.toString();
    if (!purchaseOrder.expiryBatches.some((id: any) => id.toString() === batchIdStr)) {
      purchaseOrder.expiryBatches.push(expiryBatchId);
    }
    await purchaseOrder.save();
    await purchaseOrder.populate('expiryBatches');
    return res.status(200).json({ success: true, message: MESSAGES.EXPIRED_ITEMS_BATCH_ADDED_TO_PO, order: purchaseOrder });
  } catch (error) {
    next(error);
  }
}; 