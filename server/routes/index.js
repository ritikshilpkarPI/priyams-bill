const router = require("express").Router();

const itemRoutes = require("./item-routes");
const billRoutes = require("./bill-routes");
const openCloseRoutes = require("./open-close-routes");

router.use("/api/inventory", itemRoutes);
router.use("/api/billing", billRoutes);
router.use("/api/openClose",openCloseRoutes);

module.exports = router;
