const PurchaseOrder = require('../db-models/purchase-order-model');
const { uploadMultipleImages } = require('../util/image');
const { parseStringToJson } = require('../util/parseStringToJson');
const { convertDateToIST } = require('../util/convertDateToIST');
const { getDaysBetweenDates } = require('../util/getDaysBetweenDates');
const { MESSAGES } = require('../constants/messages');
const { CONSTANTS } = require('../constants/constants');

const updatePaymentById = async (req, res, next) => {
  try {
    const purchase_id = req.params.id;

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

    if (!CONSTANTS.UPDATE_PAYMENT_BY_ID.PAYMENT_TYPES.includes(paymentType.toLowerCase())) {
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

    let updatePurchaseDetails = purchaseOrder.purchaseDetails || {};

    if (paymentMethod.toLowerCase() === CONSTANTS.UPDATE_PAYMENT_BY_ID.CREDIT) {
      const { creditAmount, payDate } = purchaseData;
      if (!creditAmount || !payDate ) {
        return res
        .status(404)
        .json({ message: MESSAGES.MISSING_REQUIRED_FIELDS, success: false });
      }
      
      const startDate = convertDateToIST(payDate).toISOString();
      const endDate = convertDateToIST(new Date()).toISOString();
      const creditLimitInDays = getDaysBetweenDates(startDate, endDate);
      
      updatePurchaseDetails.credits = [
        ...purchaseOrder.purchaseDetails.credits,
        {
          creditAmount,
          payDate,
          creditLimitInDays,
        },
      ];
    } else if (paymentMethod.toLowerCase() === CONSTANTS.UPDATE_PAYMENT_BY_ID.PAYMENT) {
      const { paidBy, paidAmount } = purchaseData;
      if (!paidBy || !paidAmount ) {
        return res
        .status(404)
        .json({ message: MESSAGES.MISSING_REQUIRED_FIELDS, success: false });
      }
      if (
        CONSTANTS.UPDATE_PAYMENT_BY_ID.PAID_BY.includes(paidBy.toLowerCase()) &&
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
      
      updatePurchaseDetails.payments = [
        ...purchaseOrder.purchaseDetails.payments,
        {
          paidBy,
          paymentImgURL,
          paidAmount: parseFloat(paidAmount).toFixed(2),
        },
      ];
    }

    const totalPaidAmount = updatePurchaseDetails.payments
      .reduce((total, payment) => total + Number(payment.paidAmount), 0)
      .toFixed(2);

    const updatedOrder = await PurchaseOrder.findByIdAndUpdate(
      purchase_id,
      {
        'purchaseDetails.credits': updatePurchaseDetails.credits,
        'purchaseDetails.payments': updatePurchaseDetails.payments,
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
