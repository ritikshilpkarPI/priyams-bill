const mongoose = require ('mongoose');
const PurchaseOrder = require('../db-models/purchase-order-model');
const { uploadMultipleImages } = require('../util/image');
const { parseStringToJson } = require('../util/parseStringToJson');
const { convertDateToIST } = require('../util/convertDateToIST');
const { getDaysBetweenDates } = require('../util/getDaysBetweenDates');
const { MESSAGES } = require('../constants/messages');

const updatePaymentById = async (req, res, next) => {
  try {
    const purchase_id = req.params.id;
     if (!mongoose.Types.ObjectId.isValid(purchase_id)){
      return res
        .status(404)
        .json({ message: MESSAGES.INVALID_ID_FORMAT, success: false });
     }

    const { type, data }  = parseStringToJson(req.body.data);
    if (!type || !data) {
      return res
      .status(404)
      .json({ message: MESSAGES.MISSING_REQUIRED_FIELDS, success: false });
    }

    const { totalPayableAmount, totalBillAmount, paymentType } = data;
    
    if (!totalPayableAmount || !totalBillAmount || !paymentType) {
      return res.status(400).json({
        message: MESSAGES.MISSING_REQUIRED_FIELDS,
        success: false,
      });
    }

    if (!['credit', 'partiallypaid', 'fullypaid'].includes(paymentType.toLowerCase())) {
      return res.status(400).json({
        message: MESSAGES.INVALID_PAYMENT_TYPE,
        success: false
      });
    }

    const purchaseOrder = await PurchaseOrder.findById(purchase_id);
    if (!purchaseOrder) {
      return res
        .status(404)
        .json({ message: MESSAGES.PURCHASE_ORDER_NOT_FOUND, success: false });
    }

    let updatedPurchaseDetails = purchaseOrder.purchaseDetails || {};

    if (type.toLowerCase() === 'credit') {
      const { creditAmount, payDate } = data;
      if (!creditAmount || !payDate ) {
        return res
        .status(404)
        .json({ message: MESSAGES.MISSING_REQUIRED_FIELDS, success: false });
      }
      
      const startDate = convertDateToIST(payDate).toISOString();
      const endDate = convertDateToIST(new Date()).toISOString();
      const creditLimitInDays = getDaysBetweenDates(startDate, endDate);
      
      updatedPurchaseDetails.credits = [
        ...purchaseOrder.purchaseDetails.credits,
        {
          creditAmount,
          payDate,
          creditLimitInDays,
        },
      ];
    } else if (type.toLowerCase() === 'payment') {
      const { paidBy, paidAmount } = data;
      if (!paidBy || !paidAmount ) {
        return res
        .status(404)
        .json({ message: MESSAGES.MISSING_REQUIRED_FIELDS, success: false });
      }
      if (
        ['upi', 'cheque', 'neft'].includes(paidBy.toLowerCase()) &&
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
      
      updatedPurchaseDetails.payments = [
        ...purchaseOrder.purchaseDetails.payments,
        {
          paidBy,
          paymentImgURL,
          paidAmount: parseFloat(paidAmount).toFixed(2),
        },
      ];
    }

    const totalPaidAmount = updatedPurchaseDetails.payments
      .reduce((total, payment) => total + Number(payment.paidAmount), 0)
      .toFixed(2);

    const updatedOrder = await PurchaseOrder.findByIdAndUpdate(
      purchase_id,
      {
        'purchaseDetails.credits': updatedPurchaseDetails.credits,
        'purchaseDetails.payments': updatedPurchaseDetails.payments,
        'purchaseDetails.totalPayableAmount': totalPayableAmount,
        'purchaseDetails.totalBillAmount': totalBillAmount,
        'purchaseDetails.paymentType': paymentType,
        totalPaidAmount,
      },
      { new: true }
    );
    res.status(200).send({
      message: MESSAGES.ORDER_UPDATED_SUCCESSFULLY,
      success: true,
      order: updatedOrder,
      updatedOrder,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = updatePaymentById;
