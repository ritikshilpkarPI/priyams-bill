const PurchaseOrder = require('../db-models/purchase-order-model');

const deletePaymentById = async (req, res,next) => {
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
    const updatedOrder = await PurchaseOrder.findByIdAndUpdate(purchase_id, {
      purchaseDetails,
      totalPaidAmount,
    }, { new: true });
    res.status(200).send({
      message: 'order deleted successfully',
      success: true,
      order: updatedOrder,
      updatedOrder,
    });
  } catch (error) {
    next(error)
  }
};


module.exports = deletePaymentById;
