const router = require("express").Router();

const itemRoutes = require("./item-routes");
const billRoutes = require("./bill-routes");
const openCloseRoutes = require("./open-close-routes");
const expenseRoutes = require('./expense-routes');
const authRoutes = require('./auth-routes');
const staffRoutes = require('./staff-routes');
const reportRoutes = require('./report-routes');
const attendanceRoutes = require('./attendance-routes');
const orderRoutes = require("./purchase-orders-routes")
const approvalRoutes = require("./approve-order-routes");
const paymentRoutes = require("./payment-routes")

router.use("/api/auth", authRoutes);
router.use("/api/inventory", itemRoutes);
router.use("/api/billing", billRoutes);
router.use("/api/openClose", openCloseRoutes);
router.use("/api", staffRoutes);
router.use("/api", expenseRoutes);
router.use("/api/report", reportRoutes);
router.use("/api/attendance", attendanceRoutes);
router.use("/api/purchaseOrder", orderRoutes)
router.use("/api/approval", approvalRoutes)
router.use("/api/payment",paymentRoutes);

module.exports = router;
