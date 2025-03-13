import { NextFunction, Request, Response } from 'express';
import { MESSAGES } from '../constants/messages';
import { CONSTANTS } from '../constants/constants';
import { purchaseDetailsType } from '../types';
import { convertDateToIST } from '../util/convertDateToIST';
import { getDaysBetweenDates } from '../util/getDaysBetweenDates';
import { uploadMultipleImages } from '../util/image';
const { parseStringToJson } = require('../util/parseStringToJson');
const PurchaseOrder = require('../db-models/purchase-order-model');

export const savePayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { paymentMethod, purchaseData } = parseStringToJson(req.body.data);

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

    if (
      ![
        CONSTANTS.CREDIT,
        CONSTANTS.PARTIALLY_PAID,
        CONSTANTS.FULLY_PAID,
      ].includes(paymentType.toLowerCase())
    ) {
      return res.status(400).json({
        message: MESSAGES.INVALID_PAYMENT_TYPE,
        success: false,
      });
    }

    const purchaseDetails: purchaseDetailsType = {
      totalPayableAmount,
      totalBillAmount,
      paymentType,
      credits: [],
      payments: [],
    };

    if (paymentMethod.toLowerCase() === CONSTANTS.CREDIT) {
      const { creditAmount, payDate } = purchaseData;
      if (!creditAmount || !payDate) {
        return res
          .status(404)
          .json({ message: MESSAGES.MISSING_REQUIRED_FIELDS, success: false });
      }

      const startDate = convertDateToIST(payDate).toISOString();
      const endDate = convertDateToIST(new Date()).toISOString();
      const creditLimitInDays = getDaysBetweenDates(startDate, endDate);

      purchaseDetails?.credits?.push({
        creditAmount,
        payDate,
        creditLimitInDays,
      });
    } else if (paymentMethod.toLowerCase() === CONSTANTS.PAYMENT) {
      const { paidBy, paidAmount } = purchaseData;
      if (!paidBy || !paidAmount) {
        return res
          .status(404)
          .json({ message: MESSAGES.MISSING_REQUIRED_FIELDS, success: false });
      }
      if (
        [CONSTANTS.UPI, CONSTANTS.NEFT].includes(paidBy.toLowerCase()) &&
        !req.files
      ) {
        return res
          .status(400)
          .json({ message: MESSAGES.PAYMENT_IMAGES_REQUIRED, success: false });
      }

      let paymentImgURL;
      if (req.files) {
        const { paymentImages } = req.files;
        const imagesArray = Array.isArray(paymentImages)
          ? paymentImages
          : [paymentImages];
        paymentImgURL = paymentImages
          ? await uploadMultipleImages(imagesArray)
          : [];
      }
      purchaseDetails?.payments?.push({
        paidBy,
        paymentImgURL,
        paidAmount: Number(parseFloat(paidAmount).toFixed(2)),
      });
    }

    const totalPaidAmount = purchaseDetails?.payments
      ?.reduce((sum, payment) => sum + Number(payment?.paidAmount), 0)
      .toFixed(2);

    const purchaseOrder = await PurchaseOrder.create({
      purchaseDetails,
      totalPaidAmount,
    });

    res.status(201).send({
      message: 'order added successfully',
      success: true,
      order: purchaseOrder,
    });
  } catch (error) {
    next(error);
  }
};
