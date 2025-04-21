import { Request, Response } from 'express';
import expiredItemsModel from '../db-models/expired-items-model';
import mongoose from 'mongoose';

export const getAllExpiryItemsBatch = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      dealerId,
      purchaseOrderId,
      itemId,
      clearanceReason,
      status,
      expiryDateFrom,
      expiryDateTo,
      manufacturingDateFrom,
      manufacturingDateTo,
      createdAtFrom,
      createdAtTo,
    } = req.query;

    const query: any = {};

    if (dealerId) query.dealerId = dealerId;
    if (status) query.status = status;
    if (clearanceReason) query['clearanceDetails.clearanceReason'] = clearanceReason;

    if (itemId) {
      query['items.itemId'] = (itemId as string);
    }

    if (purchaseOrderId) {
      query.$or = [
        { 'items.purchaseOrderId': purchaseOrderId },
        { 'clearanceDetails.clearancePurchaseOrderId': purchaseOrderId },
      ];
    }

    if (expiryDateFrom || expiryDateTo) {
      query['items.expiryDate'] = {};
      if (expiryDateFrom) query['items.expiryDate'].$gte = new Date(expiryDateFrom as string);
      if (expiryDateTo) query['items.expiryDate'].$lte = new Date(expiryDateTo as string);
    }

    if (manufacturingDateFrom || manufacturingDateTo) {
      query['items.manufacturingDate'] = {};
      if (manufacturingDateFrom) query['items.manufacturingDate'].$gte = new Date(manufacturingDateFrom as string);
      if (manufacturingDateTo) query['items.manufacturingDate'].$lte = new Date(manufacturingDateTo as string);
    }

    if (createdAtFrom || createdAtTo) {
      query.createdAt = {};
      if (createdAtFrom) query.createdAt.$gte = new Date(createdAtFrom as string);
      if (createdAtTo) query.createdAt.$lte = new Date(createdAtTo as string);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      expiredItemsModel.find(query)
        .populate('dealerId')
        .populate('stockTransactionId')
        .populate('clearanceDetails.clearancePurchaseOrderId')
        .populate('clearanceDetails.dealerId')
        .populate('items.itemId')
        .populate('items.purchaseOrderId')
        .populate('itemWiseTotalCost.itemId')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      expiredItemsModel.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : error,
    });
  }
};
