import { Request, Response } from 'express';
import expiredItemsModel from '../db-models/expired-items-model';
import { expiredStatus } from '../util/constants/expiredItemsConstant';
import { MESSAGES } from '../constants/messages';

export const markExpiryItemsBatchCleared = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    clearanceDetails,
    statusChangeRemark,
    staffId,
    browser,
    os,
    ipReferrer,
  } = req.body;

  try {
    const batch = await expiredItemsModel.findById(id);

    if (!batch) {
      return res.status(404).json({ success: false, message: MESSAGES.EXPIRED_ITEMS_BATCH_NOT_FOUND });
    }

    batch.status = expiredStatus.CLEARED;
    batch.isCleared = true;
    batch.clearanceDetails = {
      ...clearanceDetails,
      clearedOn: new Date(),
    };

    batch.statusHistory.push({
      status: expiredStatus.CLEARED,
      staffId,
      dateTime: new Date(),
      browser,
      os,
      ipReferrer,
      statusChangeRemark,
    });

    await batch.save();

    res.status(200).json({
      success: true,
      message: MESSAGES.EXPIRED_ITEMS_BATCH_MARKED_AS_CLEARED,
      data: batch,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error,
    });
  }
};
