const PurchaseOrder = require('../db-models/purchase-order-model');

const deletePaymentById = async (req, res) => {
  try {
    const purchase_id = req.params.id;
    const { index } = req.body;
    const purchaseOrder = await PurchaseOrder.findById(purchase_id);
    const purchaseDetails = purchaseOrder.purchaseDetails.filter(
      (detail, i) => i !== index
    );
    let totalPaidAmount = 0;
    purchaseDetails.forEach((payment) => {
      totalPaidAmount = totalPaidAmount + payment.paidAmount;
    });
    totalPaidAmount = Number(
      (Math.round(totalPaidAmount * 100) / 100).toFixed(2)
    );
    const updatedOrder = await purchaseOrder.updateOne({
      purchaseDetails,
      totalPaidAmount,
    });
    res.status(200).send({
      message: 'order deleted successfully',
      success: true,
      order: purchaseOrder,
      updatedOrder,
    });
  } catch (err) {
    res.status(400).send({ message: err, success: false });
  }
};


module.exports = {
  deletePaymentById,
};
