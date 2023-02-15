const approvalRoutes = require('express').Router();
const { isAdmin } = require('../middleware/isAdmin');

const {
  rejectOrder,
  approveOrder,
} = require('../controllers/approve-order-controller');

approvalRoutes.post('/rejectOrder/:id', isAdmin, rejectOrder);
approvalRoutes.post('/approveOrder/:id', isAdmin, approveOrder);

module.exports = approvalRoutes;
