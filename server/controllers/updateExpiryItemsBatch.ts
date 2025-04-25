import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import expiredItemsBatch from '../db-models/expired-items-batch-model';
import {
  ExpiredItemsSchema,
  ItemWiseTotalCostType,
  StatusHistory,
} from '../types';
import { expiredStatus } from '../util/constants/expiredItemsConstant';

export const updateExpiryItemsBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const {
      expiryBatchCost,
      status,
      items,
      itemWiseTotalCost,
      remark,
      deviceInfo,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid batch ID' });
    }

    const updatePayload: Partial<ExpiredItemsSchema> = {};
    if (expiryBatchCost !== undefined) {
      if (isNaN(Number(expiryBatchCost))) {
        return res.status(400).json({ message: 'Invalid expiryBatchCost' });
      }
      updatePayload.expiryBatchCost = Number(expiryBatchCost);
    }

    if (status !== undefined) {
      if (!Object.values(expiredStatus).includes(status)) {
        return res.status(400).json({ message: 'Invalid Status' });
      }
      updatePayload.status = status;
    }

    if (items !== undefined) {
      if (!Array.isArray(items)) {
        return res.status(400).json({ message: 'Invalid items format' });
      }
      updatePayload.items = items;
    }

    if (itemWiseTotalCost !== undefined) {
      if (!Array.isArray(itemWiseTotalCost)) {
        return res
          .status(400)
          .json({ message: 'Invalid itemWiseTotalCost format' });
      }
      updatePayload.itemWiseTotalCost =
        itemWiseTotalCost as ItemWiseTotalCostType[];
    }

    const newStatus: StatusHistory = {
      dateTime: new Date(),
      ipReferrer: req.headers.referer || '',
      status: status,
      staffId: (req as any)?.user?._id,
      statusChangeRemark: remark || '',
      browser: deviceInfo?.browser || 'Unknown',
      os: deviceInfo?.os || 'Unknown',
    };

    const updatedBatch = await expiredItemsBatch.findByIdAndUpdate(
      id,
      { $set: updatePayload, $push: { statusHistory: newStatus } },
      { new: true }
    );

    if (!updatedBatch) {
      return res.status(404).json({ message: 'Expired items batch not found' });
    }

    return res.status(200).json({
      message: 'Expired items batch updated successfully',
      data: updatedBatch,
    });
  } catch (error) {
    console.error('Error updating expired items batch:', error);
    return next(error);
  }
};
