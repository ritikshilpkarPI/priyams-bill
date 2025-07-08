import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
const PurchaseOrder = require('../db-models/purchase-order-model');
import ExpiredItemsBatch from '../db-models/expired-items-batch-model';
import { MESSAGES } from '../constants/messages';

export const removeExpiryBatchFromPO = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { purchaseOrderId, batchId } = req.body;
    if (!purchaseOrderId || !batchId) {
      return res.status(400).json({ success: false, message: MESSAGES.PURCHASE_ORDER_ID_AND_EXPIRY_BATCH_ID_REQUIRED });
    }

    const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);
    if (!purchaseOrder) {
      return res.status(404).json({ success: false, message: MESSAGES.PURCHASE_ORDER_NOT_FOUND });
    }

    // Remove the batchId from expiryBatches
    const batchIdStr = batchId.toString();
    if (purchaseOrder.expiryBatches && purchaseOrder.expiryBatches.length > 0) {
      purchaseOrder.expiryBatches = purchaseOrder.expiryBatches.filter((id: any) => id.toString() !== batchIdStr);
      await purchaseOrder.save();
    }
    return res.status(200).json({ success: true, message: 'Expiry batch removed from PO', order: purchaseOrder });
  } catch (error) {
    next(error);
  }
}; 