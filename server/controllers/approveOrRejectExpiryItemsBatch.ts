import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import expiredItemsBatch from '../db-models/expired-items-batch-model';
import { expiredStatus } from '../util/constants/expiredItemsConstant';

const genericResponse = (message: string, success = false) => ({
  success,
  message,
});

export const approveOrRejectExpiryItemsBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { deviceInfo = {}, batchId, statusChangeRemark = '', status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(batchId)) {
      return res.status(400).json(genericResponse('Invalid batch ID provided.'));
    }

    const batch = await expiredItemsBatch.findById(batchId);

    if (!batch) {
      return res.status(404).json(genericResponse('Expired items batch not found.'));
    }

    const { APPROVED, SAVED, DRAFTED } = expiredStatus;

    if (![APPROVED, SAVED].includes(status)) {
      return res.status(400).json(genericResponse('Invalid status provided.'));
    }

    const lastStatus = batch.statusHistory?.at(-1)?.status;

    if (lastStatus !== DRAFTED) {
      return res.status(400).json(genericResponse('Batch must be in drafted state to approve or reject.'));
    }

    const remark = statusChangeRemark || (status === SAVED ? 'Batch Rejected' : 'Batch Approved');

    batch.status = status;
    batch.statusHistory.push({
      status,
      statusChangeRemark: remark,
      dateTime: new Date(),
      ipReferrer: req.headers.referer || '',
      staffId: (req as any)?.user?._id,
      browser: deviceInfo?.browser || 'Unknown',
      os: deviceInfo?.os || 'Unknown',
    });

    await batch.save();

    return res.status(200).json(
      genericResponse(`Expired items batch ${batch.status.toLowerCase()} successfully.`, true)
    );
  } catch (error) {
    console.error('Error while approving or rejecting expired items batch:', error);
    return next(error);
  }
};
