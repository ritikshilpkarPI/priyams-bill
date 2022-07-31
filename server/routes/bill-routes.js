const billRoutes = require("express").Router();

const {
  addNewBill,
  getAllBill,
  getDayWiseBills,
} = require("../controllers/bill-controller");

billRoutes.post("/newBill", addNewBill);
billRoutes.get("/getBillFeed", getAllBill);
billRoutes.get("/allDailyBills", getDayWiseBills);

module.exports = billRoutes;
