const PurchaseOrder = require('../db-models/purchase-order-model');

const updatePaymentById = async (req, res,next) => {
    try {
      const purchase_id = req.params.id;
      const { index, payment } = req.body;
      const purchaseOrder = await PurchaseOrder.findById(purchase_id);
      const purchaseDetails = [
        ...purchaseOrder.purchaseDetails.filter((order, i) => i !== index),
        { ...payment, paidAmount: payment.paidAmount?.toFixed(2) },
      ];
      let totalPaidAmount = 0;
      purchaseDetails.forEach((payment) => {
        totalPaidAmount = Number(totalPaidAmount) + Number(payment.paidAmount);
      });
      parseFloat(totalPaidAmount).toFixed(2);
      const updatedOrder = await PurchaseOrder.findByIdAndUpdate(purchase_id, {
        purchaseDetails,
        totalPaidAmount,
      },  { new: true });
      res.status(200).send({
        message: 'order updated successfully',
        success: true,
        order: updatedOrder,
        updatedOrder,
      });
    } catch (error) {
      next(error)
    }
  };

  module.exports = updatePaymentById;