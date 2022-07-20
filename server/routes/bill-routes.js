const billRoutes = require("express").Router();

const { addNewBill, getAllBill } = require("../controllers/bill-controller");

billRoutes.post("/newBill", addNewBill);
billRoutes.get("/getBillFeed", getAllBill);

module.exports = billRoutes;
