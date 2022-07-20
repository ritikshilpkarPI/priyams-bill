const router = require("express").Router();

const itemRoutes = require("./item-routes");
const billRoutes = require("./bill-routes");

router.use("/api/inventory", itemRoutes);
router.use("/api/billing", billRoutes);

module.exports = router;
