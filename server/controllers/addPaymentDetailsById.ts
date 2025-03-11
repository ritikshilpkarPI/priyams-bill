import { NextFunction, Request, Response } from 'express';
import PurchaseOrder from '../db-models/purchase-order-model';
const { uploadMultipleImages } = require('../util/image');
const { parseStringToJson } = require('../util/parseStringToJson');
const { convertDateToIST } = require('../util/convertDateToIST');
const { getDaysBetweenDates } = require('../util/getDaysBetweenDates');
const { MESSAGES } = require('../constants/messages');
const { CONSTANTS } = require('../constants/constants');

export const addPaymentDetailsById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const purchaseOrderId = req.params.id;

    const { paymentMethod, purchaseData }  = parseStringToJson(req.body.data);
    if (!paymentMethod || !purchaseData) {
      return res
      .status(404)
      .json({ message: MESSAGES.MISSING_REQUIRED_FIELDS, success: false });
    }

    const { totalPayableAmount, totalBillAmount, paymentType } = purchaseData;
    
    if (!totalPayableAmount || !totalBillAmount || !paymentType) {
      return res.status(400).json({
        message: MESSAGES.MISSING_REQUIRED_FIELDS,
        success: false,
      });
    }

    if (![ CONSTANTS.CREDIT, CONSTANTS.PARTIALLY_PAID, CONSTANTS.FULLY_PAID ].includes(paymentType.toLowerCase())) {
      return res.status(400).json({
        message: MESSAGES.INVALID_PAYMENT_TYPE,
        success: false
      });
    }

    const purchaseOrder = await PurchaseOrder.findById(purchaseOrderId);

    if (!purchaseOrder) {
      return res
        .status(404)
        .json({ message: 'Purchase Order not found', success: false });
    }

    if (paymentMethod.toLowerCase() === CONSTANTS.CREDIT) {
      const { creditAmount, payDate } = purchaseData;
      if (!creditAmount || !payDate ) {
        return res
        .status(404)
        .json({ message: MESSAGES.MISSING_REQUIRED_FIELDS, success: false });
      }
      
      const startDate = convertDateToIST(payDate).toISOString();
      const endDate = convertDateToIST(new Date()).toISOString();
      const creditLimitInDays = getDaysBetweenDates(startDate, endDate);

        purchaseOrder?.purchaseDetails?.credits.push(
          {
            creditAmount,
            payDate,
            creditLimitInDays,
          } 
        )
    } else if (paymentMethod.toLowerCase() === CONSTANTS.PAYMENT) {
      const { paidBy, paidAmount } = purchaseData;
      if (!paidBy || !paidAmount ) {
        return res
        .status(404)
        .json({ message: MESSAGES.MISSING_REQUIRED_FIELDS, success: false });
      }
      if (
        [ CONSTANTS.UPI,  CONSTANTS.NEFT ].includes(paidBy.toLowerCase()) &&
        !  req.files
      ) {
        return res
          .status(400)
          .json({ message: MESSAGES.PAYMENT_IMAGES_REQUIRED, success: false });
      }

      let paymentImgURL;
      if(req.files){
        const { paymentImages } = req.files;
        paymentImgURL = paymentImages ? await uploadMultipleImages(paymentImages) : [];
      }
        purchaseOrder?.purchaseDetails?.payments.push(
          {
            paidBy,
            paymentImgURL,
            paidAmount: parseFloat(paidAmount).toFixed(2),
          },
        );
    }

    const totalPaidAmount = purchaseOrder?.purchaseDetails?.payments
      .reduce((sum, payment) => sum + Number(payment?.paidAmount), 0)
      .toFixed(2);

    const updatedOrder = await PurchaseOrder.findByIdAndUpdate(
      purchaseOrderId,
         {
           'purchaseDetails.credits': purchaseOrder?.purchaseDetails?.credits,
           'purchaseDetails.payments': purchaseOrder?.purchaseDetails?.payments,
           'purchaseDetails.totalPayableAmount': totalPayableAmount,
           'purchaseDetails.totalBillAmount': totalBillAmount,
           'purchaseDetails.paymentType': paymentType,
           totalPaidAmount,
         },
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