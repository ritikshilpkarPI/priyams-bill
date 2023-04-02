const PurchaseOrder = require('../db-models/purchase-order-model');

const updateSavedPayment = async (req, res,next) => {
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
    } catch (error) {
      next(error)
    }
  };

  module.exports = updateSavedPayment;