import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import expiredItemsBatch from '../db-models/expired-items-batch-model';
import { expiredStatus } from '../util/constants/expiredItemsConstant';

export const draftExpiryItemsBatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { deviceInfo = {}, batchId, statusChangeRemark = "" } = req.body;

    if (!mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json({ success: false, message: 'Invalid batch ID provided.' });
    }

    const batch = await expiredItemsBatch.findById(batchId);

    if (!batch) {
      return res.status(404).json({ success: false, message: 'Expired items batch not found.' });
    }

    const { DRAFTED } = expiredStatus;

    if (batch.statusHistory?.at(-1)?.status === DRAFTED) {
      return res.status(200).json({ success: true, message: 'This batch has already been drafted.' });
    }

    batch.status = DRAFTED;

    batch.statusHistory.push({
      status: DRAFTED,
      statusChangeRemark,
      dateTime: new Date(),
      ipReferrer: req.headers.referer || '',
      staffId: (req as any)?.user?._id,
      browser: deviceInfo?.browser || 'Unknown',
      os: deviceInfo?.os || 'Unknown',
    });

    await batch.save();

    res.status(200).json({
      success: true,
      message: 'Expired items batch drafted successfully.',
    });
  } catch (error) {
    console.error('Error while drafting expired items batch:', error);
    return next(error);
  }
};
