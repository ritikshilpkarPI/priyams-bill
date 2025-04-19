import { NextFunction, Request, Response } from 'express';
import expiredItem from '../db-models/expired-items-model';
import { ExpiredItems, StatusHistory } from '../types';
import mongoose from 'mongoose';
import { uploadMultipleImages } from '../util/image';
import { clodinaryFoldersPathKey } from '../util/constant';
import { expiredStatus } from '../util/constants/expiredItemsConstant';

export const createExpiryItemsBatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      boxId,
      dealerId,
      remark,
    } = req.body;

    let { items, itemWiseTotalCost, deviceInfo } = req.body;

    items = JSON.parse(req.body?.items || "")
    itemWiseTotalCost = JSON.parse(req.body?.itemWiseTotalCost || "")
    if (req.body?.deviceInfo) deviceInfo = JSON.parse(req.body?.deviceInfo)
    else deviceInfo = {};

    if (!/^[A-Za-z0-9]{6,8}$/.test(boxId)) {
      return res.status(400).json({ message: 'Invalid Box ID' });
    }

    if (!mongoose.Types.ObjectId.isValid(dealerId)) {
      return res.status(400).json({ error: 'Invalid Dealer' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items added' });
    }
    let expiryImages;
    if (req.files?.expiryImages) {
        let images = req.files?.expiryImages;
        images = Array.isArray(images) ? images : [images];
      try {
        const uploaded = await uploadMultipleImages(
          images,
          clodinaryFoldersPathKey.expiredItemsBatch
        );

        expiryImages = uploaded?.map((
            ele: { public_id: string; secure_url: string }
        ) => ({
          publicId: ele.public_id,
          secureUrl: ele.secure_url,
        }));
      } catch (error) {
        console.error('Image Upload Error:', error);
        expiryImages = [];
      }
    }

    const expiryBatchCost = Number(
      items.reduce((sum: number, item: ExpiredItems) => sum + (item.totalCostPrice || 0), 0).toFixed(2)
    );

    const newStatus: StatusHistory = {
      dateTime: new Date(),
      ipReferrer: req.headers.referer || '',
      status: expiredStatus.SAVED,
      staffId: (req as any)?.user?._id,
      statusChangeRemark: remark || '',
      browser: deviceInfo?.browser || 'Unknown',
      os: deviceInfo?.os || 'Unknown',
    };

    const savedItem = await expiredItem.create({
      boxId,
      dealerId,
      expiryImages,
      expiryBatchCost,
      status: expiredStatus.SAVED,
      statusHistory: [newStatus],
      items,
      itemWiseTotalCost,
    });

    return res.status(201).json({
      message: 'Expired item batch created successfully',
      data: savedItem,
    });
  } catch (error) {
    console.error('Error creating expired item batch:', error);
    return next(error);
  }
};
