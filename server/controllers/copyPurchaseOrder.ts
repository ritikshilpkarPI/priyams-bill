import { NextFunction, Request, Response } from "express";
import { PurchasedItem } from "server/types";

const PurchaseOrder = require('../db-models/purchase-order-model');
const { MESSAGES } = require('../constants/messages');

export const copyPurchaseOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const originalOrder = await PurchaseOrder.findById(id).lean();
    if (!originalOrder) {
      return res.status(404).json({
        message: MESSAGES.PURCHASE_ORDER_NOT_FOUND,
        success: false
      });
    }

    const newPurchaseOrder = {
      purchasedItems: originalOrder.purchasedItems.map((item: PurchasedItem) => ({
        ...item,
        _id: undefined
      })),
      purchaseDetails: {
        totalItemsCost: originalOrder.purchaseDetails?.totalItemsCost || 0,
        totalPayableAmount: 0,
        totalBillAmount: 0,
        paymentType: '',
        remark: '',
        credits: [],
        payments: []
      },
      billPhotos: [],
      billAmount: 0,
      remark: '',
      totalPaidAmount: 0,
      payment: '',
      procurementSource: originalOrder.procurementSource,
      dealerName: originalOrder.dealerName,
      phoneNumber: originalOrder.phoneNumber,
      dealerId: originalOrder.dealerId,
      isDraft: false,
      createdAt: new Date(),
      isApproved: false,
      isRejected: false,
      isPaid: false,
      payBillImage: [],
      draftTime: null,
      statusHistory: [],
      dateOnBill: null
    };

    const copiedOrder = await PurchaseOrder.create(newPurchaseOrder);

    res.status(201).json({
      message: MESSAGES.PURCHASE_ORDER_COPIED_SUCCESS,
      success: true,
      order: copiedOrder
    });
  } catch (error) {
    next(error);
  }
};

