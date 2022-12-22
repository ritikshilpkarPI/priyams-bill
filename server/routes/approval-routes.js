const approvalRoutes = require("express").Router();
const {
    rejectOrder
} = require("../controllers/approval-controller")

approvalRoutes.post("/rejectOrder/:id",rejectOrder);

module.exports = approvalRoutes