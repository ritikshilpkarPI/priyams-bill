const PurchaseOrder = require('../db-models/purchase-order-model');

const savePayment = async (req, res) => {
  try {
    const { payment } = req.body;
    const purchaseOrder = await PurchaseOrder.create({
      purchaseDetails: [payment],
      totalPaidAmount: payment.paidAmount,
    });
    res
      .status(201)
      .send({
        message: 'order added successfully',
        success: true,
        order: purchaseOrder,
      });
  } catch (err) {
    console.log({ err });
    res.status(400).send({ message: err, success: false });
  }
};
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
    res
      .status(200)
      .send({
        message: 'order added successfully',
        success: true,
        order: purchaseOrder,
        updatedOrder,
      });
  } catch (err) {
    res.status(400).send({ message: err, success: false });
  }
};
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
    res
      .status(200)
      .send({
        message: 'order deleted successfully',
        success: true,
        order: purchaseOrder,
        updatedOrder,
      });
  } catch (err) {
    res.status(400).send({ message: err, success: false });
  }
};
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
    res
      .status(200)
      .send({
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
  savePayment,
  deletePaymentById,
  updatePaymentById,
  updateSavedPayment,
};
