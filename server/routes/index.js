const router = require('express').Router();
const { isAdmin } = require('../middleware/isAdmin');
const { API_PATHS } = require('../../src/utils/constants/apiPaths');

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

router.get(API_PATHS.INVENTORY.GET_ITEMS, getItemsFeed);
router.get(API_PATHS.INVENTORY.GET_ITEMS_CATEGORY_LIST, getItemsCategoryList);
router.post(API_PATHS.INVENTORY.POST_ADD_NEW_ITEM, addItems);
router.post(API_PATHS.INVENTORY.POST_SOFT_DELETE_ITEM, softDeleteItem);
router.post(API_PATHS.INVENTORY.POST_ADD_BULK_ITEMS, addBulkItems);
router.post(API_PATHS.INVENTORY.POST_SAVE_INVENTORY, saveInventory);
router.post(API_PATHS.INVENTORY.POST_FILTER_EXPIRY_DATES, filterExpiryDates);
router.put(API_PATHS.INVENTORY.PUT_EDIT_ITEM_BY_ID, editItemById);
router.delete(
  `${API_PATHS.INVENTORY.GET_PERMANENTLY_OUT_OF_STOCK}/:id`,
  permanentlyOutOfStock
);

router.get(API_PATHS.OPENCLOSE.GET_ALL_PROCEDURE, getAllProcedure);
router.get(API_PATHS.OPENCLOSE.GET_DAY_WISE_PROCEDURE, getDayWiseProcedures);
router.post(API_PATHS.OPENCLOSE.POST_NEW_PROCEDURE_OPEN, addOpenCloseProcedure);
router.post(
  API_PATHS.OPENCLOSE.POST_NEW_PROCEDURE_CLOSE,
  addOpenCloseProcedure
);
router.put(API_PATHS.OPENCLOSE.PUT_EDIT_PROCEDURE_OPEN, editOpenCloseProcedure);
router.put(
  API_PATHS.OPENCLOSE.PUT_EDIT_PROCEDURE_CLOSE,
  editOpenCloseProcedure
);

router.post(API_PATHS.PAYMENT.POST_SAVE_PAYMENT, savePayment);
router.post(
  `${API_PATHS.PAYMENT.POST_UPDATE_SAVED_PAYMENT}/:id`,
  updateSavedPayment
);
router.post(
  `${API_PATHS.PAYMENT.POST_DELETE_PAYMENT_BY_ID}/:id`,
  deletePaymentById
);
router.post(
  `${API_PATHS.PAYMENT.POST_UPDATE_PAYMENT_BY_ID}/:id`,
  updatePaymentById
);

router.get(API_PATHS.PURCHASE_ORDER.GET_ORDERS, getOrders);
router.get(`${API_PATHS.PURCHASE_ORDER.GET_ORDER_DETAILS}/:id`, getDetailsById);
router.get(
  `${API_PATHS.PURCHASE_ORDER.GET_INDIVIDUAL_PURCHASE_ORDER}/:id`,
  getPurchaseOrderByItem
);
router.post(API_PATHS.PURCHASE_ORDER.POST_ADD_NEW_ORDER, addOrder);
router.post(API_PATHS.PURCHASE_ORDER.POST_UPDATE_DETAILS, updateDetailsById);
router.post(API_PATHS.PURCHASE_ORDER.POST_DRAFT_ORDER, draftOrder);
router.post(API_PATHS.PURCHASE_ORDER.POST_SAVE_ORDER, saveOrder);
router.post(
  `${API_PATHS.PURCHASE_ORDER.POST_UPDATE_SAVED_ORDER}/:id`,
  updateSavedOrders
);
router.post(
  `${API_PATHS.PURCHASE_ORDER.POST_DELETE_ITEM}/:id`,
  deleteOrderItemById
);
router.post(
  `${API_PATHS.PURCHASE_ORDER.POST_UPDATE_ORDER_BY_INDEX}/:id`,
  updateOrderByIndex
);
router.post(API_PATHS.PURCHASE_ORDER.GET_ORDERS_BY_QUERY, getOrdersByQuery);

router.get(API_PATHS.BILLING.GET_BILL_FEED, getAllBill);
router.get(API_PATHS.BILLING.GET_ALL_DAILY_BILLS, getDayWiseBills);
router.get(`${API_PATHS.BILLING.GET_EDIT_BILL}/:id`, getEditBill);
router.get(API_PATHS.BILLING.GET_USER_DETAILS, userDetails);
router.put(API_PATHS.BILLING.PUT_EDIT_BILL, editBill);
router.post(API_PATHS.BILLING.POST_SEND_MESSAGE, sendMessage);
router.post(API_PATHS.BILLING.POST_NEW_BILL, addNewBill);
router.delete(API_PATHS.BILLING.DELETE_BILL, deleteBill);

//attendance APIs
router.post(
  API_PATHS.ATTENDANCE.POST_DAILY_ATTENDANCE_ARRIVAL,
  addDailyAttendanceArrival
);
router.post(
  API_PATHS.ATTENDANCE.POST_DAILY_ATTENDANCE_LEAVING,
  addDailyAttendanceLeaving
);
router.post(API_PATHS.ATTENDANCE.POST_DAILY_ATTENDANCE, getDatesWiseAttendance);
router.post(API_PATHS.ATTENDANCE.POST_MARK_ABSENT, markAbsent);
router.get(API_PATHS.ATTENDANCE.GET_MONTHLY_ATTENDANCE, getMonthlyAttendance);

router.post(
  `${API_PATHS.APPROVAL.POST_REJECT_ORDER}/:id`,
  isAdmin,
  rejectOrder
);
router.post(
  `${API_PATHS.APPROVAL.POST_APPROVE_ORDER}/:id`,
  isAdmin,
  approveOrder
);

router.post(API_PATHS.AUTH.POST_LOGIN, loginUser);
router.get(API_PATHS.AUTH.GET_LOGOUT, logoutUser);

router.post(
  `${API_PATHS.REPORT.POST_GET_DATE_RANGE_REPORT}/:filterName`,
  getDateRangeReport
);

router.get(API_PATHS.STAFF.GET_STAFF, getStaff);
router.post(API_PATHS.STAFF.POST_STAFF, addStaff);
router.put(`${API_PATHS.STAFF.PUT_STAFF}/:username`, updateStaff);
router.delete(`${API_PATHS.STAFF.DELETE_STAFF}/:username`, deleteStaff);

router.get(API_PATHS.EXPENSE.GET_EXPENSE, sendAllExpense);
router.post(API_PATHS.EXPENSE.POST_EXPENSE, addExpense);
router.delete(`${API_PATHS.EXPENSE.DELETE_EXPENSE}/:id`, deleteExpense);
router.put(`${API_PATHS.EXPENSE.PUT_EXPENSE}/:id`, updateExpense);
router.get(`${API_PATHS.EXPENSE.GET_EXPENSE}/:date`, sendDayExpenses);

module.exports = router;
