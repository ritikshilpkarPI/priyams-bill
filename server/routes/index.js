const router = require('express').Router();
const { isAdmin, isLoggedIn, customRole } = require('../middleware/isAdmin');

const {
  getItemsFeed,
  addItems,
  editItemById,
  softDeleteItem,
  addBulkItems,
  saveInventory,
  permanentlyOutOfStock,
  filterExpiryDates,
  getItemsCategoryList,
} = require('../controllers/item-controller');

const {
  addOpenCloseProcedure,
  editOpenCloseProcedure,
  getAllProcedure,
  getDayWiseProcedures,
} = require('../controllers/open-close-controller');

const {
  savePayment,
  deletePaymentById,
  updatePaymentById,
  updateSavedPayment,
} = require('../controllers/payment-controller');

const {
  addOrder,
  getOrders,
  getDetailsById,
  updateDetailsById,
  draftOrder,
  saveOrder,
  updateSavedOrders,
  deleteOrderItemById,
  updateOrderByIndex,
  getOrdersByQuery,
  getPurchaseOrderByItem,
} = require('../controllers/purchase-order-controller');

const {
  addNewBill,
  getAllBill,
  getDayWiseBills,
  getEditBill,
  editBill,
  sendMessage,
  userDetails,
  deleteBill,
} = require('../controllers/bill-controller');

const {
  addDailyAttendanceArrival,
  addDailyAttendanceLeaving,
  getDatesWiseAttendance,
  getMonthlyAttendance,
  markAbsent,
} = require('../controllers/daily-attendance-controller');

const {
  rejectOrder,
  approveOrder,
} = require('../controllers/approve-order-controller');

const { 
  loginUser,
  logoutUser,
} = require('../controllers/auth-controller');

const { 
  getDateRangeReport 
} = require('../controllers/report-controller');

const {
    getStaff, 
    addStaff, 
    updateStaff, 
    deleteStaff
} = require('../controllers/staff-controller');

const {
    addExpense,
    deleteExpense,
    sendAllExpense,
    updateExpense,
    sendDayExpenses,
} = require('../controllers/expense-controller');

router.get('/api/inventory/items',isLoggedIn,customRole(['admin']) ,getItemsFeed);
router.get('/api/inventory/getItemsCategoryList',isLoggedIn, getItemsCategoryList);
router.post('/api/inventory/addNewItem', isLoggedIn, addItems);
router.post('/api/inventory/softDeleteItem', isLoggedIn, softDeleteItem);
router.post('/api/inventory/addbulkitems', isLoggedIn, addBulkItems);
router.post('/api/inventory/saveInventory', isLoggedIn, saveInventory);
router.post('/api/inventory/filterExpiryDates', isLoggedIn, filterExpiryDates);
router.put('/api/inventory/editItemById', isLoggedIn, editItemById);
router.delete(
  '/api/inventory/permanentlyOutOfStock/:id',
  permanentlyOutOfStock
);

router.get('/api/openClose/getAllProcedure', getAllProcedure);
router.get('/api/openClose/getDayWiseProcedure',isLoggedIn, getDayWiseProcedures);
router.post('/api/openClose/newProcedure/open',isLoggedIn, addOpenCloseProcedure);
router.post('/api/openClose/newProcedure/close',isLoggedIn, addOpenCloseProcedure);
router.put('/api/openClose/editProcedure/open',isLoggedIn, editOpenCloseProcedure);
router.put('/api/openClose/editProcedure/close',isLoggedIn, editOpenCloseProcedure);

router.post('/api/payment/savePayment',isLoggedIn, savePayment);
router.post('/api/payment/updateSavedPayment/:id',isLoggedIn, updateSavedPayment);
router.post('/api/payment/deletePaymentById/:id',isLoggedIn, deletePaymentById);
router.post('/api/payment/updatePaymentById/:id',isLoggedIn, updatePaymentById);

router.get('/api/purchaseOrder/orders',isLoggedIn, getOrders);
router.get('/api/purchaseOrder/orderDetails/:id',isLoggedIn, getDetailsById);
router.get(
  '/api/purchaseOrder/individualPurchaseOrder/:id',isLoggedIn,
  getPurchaseOrderByItem
);
router.post('/api/purchaseOrder/addNewOrder', isLoggedIn, addOrder);
router.post('/api/purchaseOrder/updateDetails', isLoggedIn, updateDetailsById);
router.post('/api/purchaseOrder/draftOrder', isLoggedIn, draftOrder);
router.post('/api/purchaseOrder/saveOrder', isLoggedIn, saveOrder);
router.post('/api/purchaseOrder/updateSavedOrder/:id', isLoggedIn, updateSavedOrders);
router.post('/api/purchaseOrder/deleteItem/:id', isLoggedIn, deleteOrderItemById);
router.post('/api/purchaseOrder/updateOrderByIndex/:id', isLoggedIn, updateOrderByIndex);
router.post('/api/purchaseOrder/getOrdersByQuery', isLoggedIn, getOrdersByQuery);

router.get('/api/billing/getBillFeed', isLoggedIn, getAllBill);
router.get('/api/billing/allDailyBills', isLoggedIn, isLoggedIn , isLoggedIn,getDayWiseBills);
router.get('/api/billing/getEditBill/:id', isLoggedIn, getEditBill);
router.get('/api/billing/userDetails', isLoggedIn, userDetails);
router.put('/api/billing/editBill', isLoggedIn, editBill);
router.post('/api/billing/sendMessage', isLoggedIn, sendMessage);
router.post('/api/billing/newBill', isLoggedIn, addNewBill);
router.delete('/api/billing/deleteBill', isLoggedIn, deleteBill);

router.post(
  '/api/attendance/dailyAttendanceArrival', isLoggedIn,
  addDailyAttendanceArrival
);
router.post(
  '/api/attendance/dailyAttendanceLeaving', isLoggedIn,
  addDailyAttendanceLeaving
);
router.post('/api/attendance/dailyAttendance', isLoggedIn, getDatesWiseAttendance);
router.post('/api/attendance/markAbsent', isLoggedIn, markAbsent);
router.get('/api/attendance/monthlyAttendance', isLoggedIn, getMonthlyAttendance);

router.post('/api/approval/rejectOrder/:id', isLoggedIn, isAdmin, isLoggedIn, rejectOrder);
router.post('/api/approval/approveOrder/:id', isLoggedIn, isAdmin, isLoggedIn, approveOrder);

router.post('/api/auth/login', isLoggedIn, loginUser);
router.get('/api/auth/logout', isLoggedIn, logoutUser);

router.post('/api/report/getDateRangeReport/:filterName', isLoggedIn, getDateRangeReport);

router.get('/api/staff', isLoggedIn, getStaff);
router.post('/api/staff', isLoggedIn, addStaff);
router.put('/api/staff/:username', isLoggedIn, updateStaff);
router.delete('/api/staff/:username', isLoggedIn, deleteStaff);

router.get('/api/expense', isLoggedIn, sendAllExpense);
router.post('/api/expense', isLoggedIn, addExpense);
router.delete('/api/expense/:id', isLoggedIn, deleteExpense);
router.put('/api/expense/:id', isLoggedIn, updateExpense);
router.get('/api/expense/:date', isLoggedIn, sendDayExpenses);

module.exports = router;
