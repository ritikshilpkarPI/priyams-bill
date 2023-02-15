const paymentRoutes = require('express').Router();
const {
  savePayment,
  deletePaymentById,
  updatePaymentById,
  updateSavedPayment,
} = require('../controllers/payment-controller');
paymentRoutes.post('/savePayment', savePayment);
paymentRoutes.post('/updateSavedPayment/:id', updateSavedPayment);
paymentRoutes.post('/deletePaymentById/:id', deletePaymentById);
paymentRoutes.post('/updatePaymentById/:id', updatePaymentById);
module.exports = paymentRoutes;
