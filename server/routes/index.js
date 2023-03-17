const router = require('express').Router();
const { isAdmin } = require('../middleware/isAdmin');

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

router.get('/api/openClose/getAllProcedure', getAllProcedure);
router.get('/api/openClose/getDayWiseProcedure', getDayWiseProcedures);
router.post('/api/openClose/newProcedure/open', addOpenCloseProcedure);
router.post('/api/openClose/newProcedure/close', addOpenCloseProcedure);
router.put('/api/openClose/editProcedure/open', editOpenCloseProcedure);
router.put('/api/openClose/editProcedure/close', editOpenCloseProcedure);

router.post('/api/payment/savePayment', savePayment);
router.post('/api/payment/updateSavedPayment/:id', updateSavedPayment);
router.post('/api/payment/deletePaymentById/:id', deletePaymentById);
router.post('/api/payment/updatePaymentById/:id', updatePaymentById);

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

router.get('/api/billing/getBillFeed', getAllBill);
router.get('/api/billing/allDailyBills', getDayWiseBills);
router.get('/api/billing/getEditBill/:id', getEditBill);
router.get('/api/billing/userDetails', userDetails);
router.put('/api/billing/editBill', editBill);
router.post('/api/billing/sendMessage', sendMessage);
router.post('/api/billing/newBill', addNewBill);
router.delete('/api/billing/deleteBill', deleteBill);

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

router.post('/api/approval/rejectOrder/:id', isAdmin, rejectOrder);
router.post('/api/approval/approveOrder/:id', isAdmin, approveOrder);

router.post('/api/auth/login', loginUser);
router.get('/api/auth/logout', logoutUser);

router.post('/api/report/getDateRangeReport/:filterName', getDateRangeReport);

router.get('/api/staff', getStaff);
router.post('/api/staff', addStaff);
router.put('/api/staff/:username', updateStaff);
router.delete('/api/staff/:username', deleteStaff);

router.get('/api/expense', sendAllExpense);
router.post('/api/expense', addExpense);
router.delete('/api/expense/:id', deleteExpense);
router.put('/api/expense/:id', updateExpense);
router.get('/api/expense/:date', sendDayExpenses);

module.exports = router;
