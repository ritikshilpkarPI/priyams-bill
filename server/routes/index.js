const router = require('express').Router();
const { isAdmin } = require('../middleware/isAdmin');


const {
  getStaff,
  addBulkItems,
  addDailyAttendanceArrival,
  addDailyAttendanceLeaving,
  addItems,
  addExpense,
  addNewBill,
  addOpenCloseProcedure,
  addOrder,
  addStaff,
  approveOrder,
  deleteBill,
  deleteExpense,
  deleteOrderItemById,
  deletePaymentById,
  deleteStaff,
  draftOrder,
  editBill,
  editItemById,
  editOpenCloseProcedure,
  filterExpiryDates,
  getAllBill,
  getAllProcedure,
  getDateRangeReport,
  getDatesWiseAttendance,
  getDayWiseBills,
  getDayWiseProcedures,
  getDetailsById,
  getEditBill,
  getItemsCategoryList,
  getItemsFeed,
  getMonthlyAttendance,
  getOrders,
  getOrdersByQuery,
  getPurchaseOrderByItem,
  loginUser,
  logoutUser,
  markAbsent,
  permanentlyOutOfStock,
  rejectOrder,
  saveInventory,
  saveOrder,
  savePayment,
  sendAllExpense,
  sendDayExpenses,
  sendMessage,
  softDeleteItem,
  updateDetailsById,
  updateExpense,
  updateOrderByIndex,
  updatePaymentById,
  updateSavedOrders,
  updateSavedPayment,
  updateStaff,
  userDetails,
} = require('../controllers/index');

//inventory APIs
router.get('/api/inventory/items', getItemsFeed);
router.get('/api/inventory/getItemsCategoryList', getItemsCategoryList);
router.post('/api/inventory/addNewItem', addItems);
router.post('/api/inventory/softDeleteItem', softDeleteItem);
router.post('/api/inventory/addbulkitems', addBulkItems);
router.post('/api/inventory/saveInventory', saveInventory);
router.post('/api/inventory/filterExpiryDates', filterExpiryDates);
router.put('/api/inventory/editItemById', editItemById);
router.delete(
  '/api/inventory/permanentlyOutOfStock/:id',
  permanentlyOutOfStock
);

//openClose APIs
router.get('/api/openClose/getAllProcedure', getAllProcedure);
router.get('/api/openClose/getDayWiseProcedure', getDayWiseProcedures);
router.post('/api/openClose/newProcedure/open', addOpenCloseProcedure);
router.post('/api/openClose/newProcedure/close', addOpenCloseProcedure);
router.put('/api/openClose/editProcedure/open', editOpenCloseProcedure);
router.put('/api/openClose/editProcedure/close', editOpenCloseProcedure);


//payment APIs
router.post('/api/payment/savePayment', savePayment);
router.post('/api/payment/updateSavedPayment/:id', updateSavedPayment);
router.post('/api/payment/deletePaymentById/:id', deletePaymentById);
router.post('/api/payment/updatePaymentById/:id', updatePaymentById);


//purchaseOrder APIs
router.get('/api/purchaseOrder/orders', getOrders);
router.get('/api/purchaseOrder/orderDetails/:id', getDetailsById);
router.get(
  '/api/purchaseOrder/individualPurchaseOrder/:id',
  getPurchaseOrderByItem
);
router.post('/api/purchaseOrder/addNewOrder', addOrder);
router.post('/api/purchaseOrder/updateDetails', updateDetailsById);
router.post('/api/purchaseOrder/draftOrder', draftOrder);
router.post('/api/purchaseOrder/saveOrder', saveOrder);
router.post('/api/purchaseOrder/updateSavedOrder/:id', updateSavedOrders);
router.post('/api/purchaseOrder/deleteItem/:id', deleteOrderItemById);
router.post('/api/purchaseOrder/updateOrderByIndex/:id', updateOrderByIndex);
router.post('/api/purchaseOrder/getOrdersByQuery', getOrdersByQuery);


//billing APIs
router.get('/api/billing/getBillFeed', getAllBill);
router.get('/api/billing/allDailyBills', getDayWiseBills);
router.get('/api/billing/getEditBill/:id', getEditBill);
router.get('/api/billing/userDetails', userDetails);
router.put('/api/billing/editBill', editBill);
router.post('/api/billing/sendMessage', sendMessage);
router.post('/api/billing/newBill', addNewBill);
router.delete('/api/billing/deleteBill', deleteBill);


//attendance APIs
router.post(
  '/api/attendance/dailyAttendanceArrival',
  addDailyAttendanceArrival
);
router.post(
  '/api/attendance/dailyAttendanceLeaving',
  addDailyAttendanceLeaving
);
router.post('/api/attendance/dailyAttendance', getDatesWiseAttendance);
router.post('/api/attendance/markAbsent', markAbsent);
router.get('/api/attendance/monthlyAttendance', getMonthlyAttendance);


//approval APIs
router.post('/api/approval/rejectOrder/:id', isAdmin, rejectOrder);
router.post('/api/approval/approveOrder/:id', isAdmin, approveOrder);


//auth APIs
router.post('/api/auth/login', loginUser);
router.get('/api/auth/logout', logoutUser);


//report APIs
router.post('/api/report/getDateRangeReport/:filterName', getDateRangeReport);


//staff APIs
router.get('/api/staff', getStaff);
router.post('/api/staff', addStaff);
router.put('/api/staff/:username', updateStaff);
router.delete('/api/staff/:username', deleteStaff);


//expense APIs
router.get('/api/expense', sendAllExpense);
router.post('/api/expense', addExpense);
router.delete('/api/expense/:id', deleteExpense);
router.put('/api/expense/:id', updateExpense);
router.get('/api/expense/:date', sendDayExpenses);

module.exports = router;
