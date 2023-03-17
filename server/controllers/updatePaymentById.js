const PurchaseOrder = require('../db-models/purchase-order-model');

const updatePaymentById = async (req, res) => {
    try {
      const purchase_id = req.params.id;
      const { index, payment } = req.body;
      const purchaseOrder = await PurchaseOrder.findById(purchase_id);
      const purchaseDetails = [
        ...purchaseOrder.purchaseDetails.filter((order, i) => i != index),
        payment,
      ];
      let totalPaidAmount = 0;
      purchaseDetails.forEach((payment) => {
        totalPaidAmount = totalPaidAmount + payment.paidAmount;
      });
      totalPaidAmount.toFixed(2);
      const updatedOrder = await purchaseOrder.updateOne({
        purchaseDetails,
        totalPaidAmount,
      });
      res.status(200).send({
        message: 'order updated successfully',
        success: true,
        order: purchaseOrder,
        updatedOrder,
      });
    } catch (err) {
      res.status(400).send({ message: err, success: false });
    }
  };

  module.exports = {
    updatePaymentById,
  };