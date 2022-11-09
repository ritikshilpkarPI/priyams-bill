const billRoutes = require("express").Router();

const {
  addNewBill,
  getAllBill,
  getDayWiseBills,
  getEditBill,
  editBill,
  sendMessage,
  userDetails
} = require("../controllers/bill-controller");

billRoutes.post("/newBill", addNewBill);
billRoutes.get("/getBillFeed", getAllBill);
billRoutes.get("/allDailyBills", getDayWiseBills);
billRoutes.get("/getEditBill/:id", getEditBill);
billRoutes.put("/editBill", editBill)
billRoutes.post("/sendMessage", sendMessage)
billRoutes.get("/userDetails", userDetails)

module.exports = billRoutes;
