const PurchaseOrder = require('../db-models/purchase-order-model');

const updateSavedPayment = async (req, res) => {
    try {
      const id = req.params.id;
      const { payment } = req.body;
      const purchaseOrder = await PurchaseOrder.findById(id);
      const updatedOrder = await purchaseOrder.updateOne({
        purchaseDetails: [...purchaseOrder.purchaseDetails, payment],
        totalPaidAmount: (
          Number(purchaseOrder.totalPaidAmount) + Number(payment.paidAmount)
        ).toFixed(2),
      });
      res.status(200).send({
        message: 'order added successfully',
        success: true,
        order: purchaseOrder,
        updatedOrder,
      });
    } catch (err) {
      res.status(400).send({ message: err, success: false });
    }
  };

  module.exports = {
    updateSavedPayment,
  };