const PurchaseOrder = require('../db-models/purchase-order-model');

const savePayment = async (req, res) => {
    try {
      const { payment } = req.body;
      const purchaseOrder = await PurchaseOrder.create({
        purchaseDetails: [payment],
        totalPaidAmount: payment.paidAmount,
      });
      res.status(201).send({
        message: 'order added successfully',
        success: true,
        order: purchaseOrder,
      });
    } catch (err) {
      console.log({ err });
      res.status(400).send({ message: err, success: false });
    }
  };

  module.exports = savePayment;