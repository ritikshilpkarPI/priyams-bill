const router = require("express").Router();

const itemRoutes = require("./item-routes");
const billRoutes = require("./bill-routes");
const openCloseRoutes = require("./open-close-routes");
const expenseRoutes = require('./expense.route');

router.use("/api/inventory", itemRoutes);
router.use("/api/billing", billRoutes);
router.use("/api/openClose", openCloseRoutes);
router.use("/api/openClose", openCloseRoutes);
router.use("/api", expenseRoutes);

module.exports = router;
