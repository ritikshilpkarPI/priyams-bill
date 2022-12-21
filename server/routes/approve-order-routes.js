const approvalRoutes =  require("express").Router();

const {
    rejectOrder,
    approveOrder
} = require("../controllers/approve-order-controller");

approvalRoutes.post('/rejectOrder/:id',rejectOrder);
approvalRoutes.post('/approveOrder/:id',approveOrder);

module.exports = approvalRoutes;