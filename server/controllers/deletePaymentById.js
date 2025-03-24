const PurchaseOrder = require('../db-models/purchase-order-model');
const { CONSTANTS } = require('../constants/constants');
const { MESSAGES } = require('../constants/messages');

const deletePaymentById = async (req, res, next) => {
  try {
    const purchase_id = req.params.id;
    const { paymentMethod, paymentId } = req.body;

    if (!paymentMethod || !paymentId) {
      return res.status(400).json({
        message: MESSAGES.MISSING_REQUIRED_FIELDS,
        success: false,
      });
    }

    const purchaseOrder = await PurchaseOrder.findById(purchase_id);
    if (!purchaseOrder) {
      return res.status(404).json({
        message: MESSAGES.PURCHASE_ORDER_NOT_FOUND,
        success: false,
      });
    }

    if (paymentMethod.toLowerCase() === CONSTANTS.CREDIT) {
      if (!purchaseOrder.purchaseDetails?.credits?.length) {
        return res.status(400).json({
          message: MESSAGES.NO_CREDITS_FOUND,
          success: false,
        });
      }
      const initialLength = purchaseOrder.purchaseDetails.credits.length;

      purchaseOrder.purchaseDetails.credits.pull({ _id: paymentId });
      if (purchaseOrder.purchaseDetails.credits.length === initialLength) {
        return res.status(400).json({
          message: MESSAGES.CREDIT_NOT_FOUND,
          success: false,
        });
      }
    } else if (paymentMethod.toLowerCase() === CONSTANTS.PAYMENT) {
      if (!purchaseOrder.purchaseDetails?.payments?.length) {
        return res.status(400).json({
          message: MESSAGES.NO_PAYMENTS_FOUND,
          success: false,
        });
      }
      const initialLength = purchaseOrder.purchaseDetails.payments.length;
      purchaseOrder.purchaseDetails.payments.pull({ _id: paymentId });
      if (purchaseOrder.purchaseDetails.payments.length === initialLength) {
        return res.status(400).json({
          message: MESSAGES.PAYMENT_NOT_FOUND,
          success: false,
        });
      }
    }

    const totalPaidAmount = purchaseOrder.purchaseDetails?.payments
    ?.reduce((sum, payment) => sum + (payment.paidAmount || 0), 0)
    .toFixed(2);

    purchaseOrder.totalPaidAmount = Number(totalPaidAmount);

    await purchaseOrder.save();

    res.status(200).send({
      message: MESSAGES.PAYMENT_DELETED_SUCCESSFULLY,
      success: true,
      order: purchaseOrder,
      purchaseOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = deletePaymentById;
