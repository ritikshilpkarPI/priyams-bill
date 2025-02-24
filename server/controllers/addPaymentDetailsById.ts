import { NextFunction, Request, Response } from 'express';
import PurchaseOrder from '../db-models/purchase-order-model';

export const addPaymentDetailsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const purchaseOrderId = req.params.id;
    const { payment } = req.body;

    const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);

    if (!purchaseOrder) {
      return res
        .status(404)
        .json({ message: 'Purchase Order not found', success: false });
    }

    const updatedPurchaseDetails = [
      ...purchaseOrder.purchaseDetails,
      {
        paidAmount: payment.paidAmount,
        paidBy: payment.paidBy,
        chequeNumber: payment.chequeNumber,
      },
    ];

    const totalPaidAmount = updatedPurchaseDetails
      .reduce((sum, payment) => sum + payment.paidAmount, 0)
      .toFixed(2);

    const updatedOrder = await PurchaseOrder.findByIdAndUpdate(
        purchaseOrderId,
      { purchaseDetails: updatedPurchaseDetails, totalPaidAmount },
      { new: true }
    );

    res.status(200).json({
      message: 'order updated successfully',
      success: true,
      purchaseOrder: updatedOrder,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
