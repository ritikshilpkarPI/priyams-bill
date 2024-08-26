const router = require('express').Router();
const { isAdmin, isLoggedIn } = require('../middleware/isAdmin');
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
  getCustomerBill,
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
  getUserOrders,
  updateOrderStatus,
  getItemsWithNoImages,
  getItemsLean,
  saveOrCacheBill,
  getUnSavedBills,
  addItemsToCartApp,
  getProductImageByProductName
} = require('../controllers/index');

// online order apis
router.get(API_PATHS.ORDERS.GET_USER_ORDERS, isLoggedIn, getUserOrders);
router.post(API_PATHS.ORDERS.UPDATE_USER_ORDERS, isLoggedIn, updateOrderStatus);

router.get(API_PATHS.INVENTORY.GET_ITEMS, isLoggedIn, getItemsFeed);
router.get(
  API_PATHS.INVENTORY.GET_ITEMS_LEAN_FOR_BILLING,
  isLoggedIn,
  getItemsLean
);
router.get(
  API_PATHS.INVENTORY.GET_ITEMS_CATEGORY_LIST,
  isLoggedIn,
  getItemsCategoryList
);
router.get(API_PATHS.INVENTORY.GET_ITEMS_WITH_NO_IMAGES, getItemsWithNoImages);
router.post(API_PATHS.INVENTORY.POST_ADD_NEW_ITEM, isLoggedIn, addItems);
router.post(
  API_PATHS.INVENTORY.POST_SOFT_DELETE_ITEM,
  isLoggedIn,
  softDeleteItem
);
router.post(API_PATHS.INVENTORY.POST_ADD_BULK_ITEMS, isLoggedIn, addBulkItems);
router.post(API_PATHS.INVENTORY.POST_SAVE_INVENTORY, isLoggedIn, saveInventory);
router.post(
  API_PATHS.INVENTORY.POST_FILTER_EXPIRY_DATES,
  isLoggedIn,
  filterExpiryDates
);
router.put(API_PATHS.INVENTORY.PUT_EDIT_ITEM_BY_ID, isLoggedIn, editItemById);
router.delete(
  `${API_PATHS.INVENTORY.GET_PERMANENTLY_OUT_OF_STOCK}/:id`,
  isLoggedIn,
  permanentlyOutOfStock
);

router.get(API_PATHS.OPENCLOSE.GET_ALL_PROCEDURE, isLoggedIn, getAllProcedure);
router.get(
  API_PATHS.OPENCLOSE.GET_DAY_WISE_PROCEDURE,
  isLoggedIn,
  getDayWiseProcedures
);
router.post(
  API_PATHS.OPENCLOSE.POST_NEW_PROCEDURE_OPEN,
  isLoggedIn,
  addOpenCloseProcedure
);
router.post(
  API_PATHS.OPENCLOSE.POST_NEW_PROCEDURE_CLOSE,
  isLoggedIn,
  addOpenCloseProcedure
);
router.put(
  API_PATHS.OPENCLOSE.PUT_EDIT_PROCEDURE_OPEN,
  isLoggedIn,
  editOpenCloseProcedure
);
router.put(
  API_PATHS.OPENCLOSE.PUT_EDIT_PROCEDURE_CLOSE,
  isLoggedIn,
  editOpenCloseProcedure
);

router.post(API_PATHS.PAYMENT.POST_SAVE_PAYMENT, isLoggedIn, savePayment);
router.post(
  `${API_PATHS.PAYMENT.POST_UPDATE_SAVED_PAYMENT}/:id`,
  isLoggedIn,
  updateSavedPayment
);
router.post(
  `${API_PATHS.PAYMENT.POST_DELETE_PAYMENT_BY_ID}/:id`,
  isLoggedIn,
  deletePaymentById
);
router.post(
  `${API_PATHS.PAYMENT.POST_UPDATE_PAYMENT_BY_ID}/:id`,
  isLoggedIn,
  updatePaymentById
);

router.get(API_PATHS.PURCHASE_ORDER.GET_ORDERS, isLoggedIn, getOrders);
router.get(
  `${API_PATHS.PURCHASE_ORDER.GET_ORDER_DETAILS}/:id`,
  isLoggedIn,
  getDetailsById
);
router.get(
  `${API_PATHS.PURCHASE_ORDER.GET_INDIVIDUAL_PURCHASE_ORDER}/:id`,
  isLoggedIn,
  getPurchaseOrderByItem
);
router.post(API_PATHS.PURCHASE_ORDER.POST_ADD_NEW_ORDER, isLoggedIn, addOrder);
router.post(
  API_PATHS.PURCHASE_ORDER.POST_UPDATE_DETAILS,
  isLoggedIn,
  updateDetailsById
);
router.post(API_PATHS.PURCHASE_ORDER.POST_DRAFT_ORDER, isLoggedIn, draftOrder);
router.post(API_PATHS.PURCHASE_ORDER.POST_SAVE_ORDER, isLoggedIn, saveOrder);
router.post(
  `${API_PATHS.PURCHASE_ORDER.POST_UPDATE_SAVED_ORDER}/:id`,
  isLoggedIn,
  updateSavedOrders
);
router.post(
  `${API_PATHS.PURCHASE_ORDER.POST_DELETE_ITEM}/:id`,
  isLoggedIn,
  deleteOrderItemById
);
router.post(
  `${API_PATHS.PURCHASE_ORDER.POST_UPDATE_ORDER_BY_INDEX}/:id`,
  isLoggedIn,
  updateOrderByIndex
);
router.post(
  API_PATHS.PURCHASE_ORDER.GET_ORDERS_BY_QUERY,
  isLoggedIn,
  getOrdersByQuery
);

router.get(API_PATHS.BILLING.GET_BILL_FEED, isLoggedIn, getAllBill);
router.get(API_PATHS.BILLING.GET_ALL_DAILY_BILLS, isLoggedIn, getDayWiseBills);
router.get(`${API_PATHS.BILLING.GET_EDIT_BILL}/:id`, isLoggedIn, getEditBill);
router.get(`${API_PATHS.BILLING.GET_CUSTOMER_BILL}/:id`, getCustomerBill);
router.get(API_PATHS.BILLING.GET_USER_DETAILS, isLoggedIn, userDetails);
router.put(API_PATHS.BILLING.PUT_EDIT_BILL, isLoggedIn, editBill);
router.post(API_PATHS.BILLING.POST_SEND_MESSAGE, isLoggedIn, sendMessage);
router.post(API_PATHS.BILLING.POST_NEW_BILL, isLoggedIn, addNewBill);
router.delete(API_PATHS.BILLING.DELETE_BILL, isLoggedIn, deleteBill);
router.post(API_PATHS.BILLING.SAVE_OR_CACHE_BILL, isLoggedIn, saveOrCacheBill);
router.get(API_PATHS.BILLING.GET_UNSAVED_BILLS, isLoggedIn, getUnSavedBills);

//attendance APIs
router.post(
  API_PATHS.ATTENDANCE.POST_DAILY_ATTENDANCE_ARRIVAL,
  isLoggedIn,
  addDailyAttendanceArrival
);
router.post(
  API_PATHS.ATTENDANCE.POST_DAILY_ATTENDANCE_LEAVING,
  isLoggedIn,
  addDailyAttendanceLeaving
);
router.post(
  API_PATHS.ATTENDANCE.POST_DAILY_ATTENDANCE,
  isLoggedIn,
  getDatesWiseAttendance
);
router.post(API_PATHS.ATTENDANCE.POST_MARK_ABSENT, isLoggedIn, markAbsent);
router.get(
  API_PATHS.ATTENDANCE.GET_MONTHLY_ATTENDANCE,
  isLoggedIn,
  getMonthlyAttendance
);

router.post(
  `${API_PATHS.APPROVAL.POST_REJECT_ORDER}/:id`,
  isLoggedIn,
  isAdmin,
  isLoggedIn,
  rejectOrder
);
router.post(
  `${API_PATHS.APPROVAL.POST_APPROVE_ORDER}/:id`,
  isLoggedIn,
  isAdmin,
  isLoggedIn,
  approveOrder
);

router.post(API_PATHS.AUTH.POST_LOGIN, loginUser);
router.get(API_PATHS.AUTH.GET_LOGOUT, isLoggedIn, logoutUser);

router.post(
  `${API_PATHS.REPORT.POST_GET_DATE_RANGE_REPORT}/:filterName`,
  isLoggedIn,
  getDateRangeReport
);

router.get(API_PATHS.STAFF.GET_STAFF, isLoggedIn, getStaff);
router.post(API_PATHS.STAFF.POST_STAFF, isLoggedIn, addStaff);
router.put(`${API_PATHS.STAFF.PUT_STAFF}/:username`, isLoggedIn, updateStaff);
router.delete(
  `${API_PATHS.STAFF.DELETE_STAFF}/:username`,
  isLoggedIn,
  deleteStaff
);

router.get(API_PATHS.EXPENSE.GET_EXPENSE, isLoggedIn, sendAllExpense);
router.post(API_PATHS.EXPENSE.POST_EXPENSE, isLoggedIn, addExpense);
router.delete(
  `${API_PATHS.EXPENSE.DELETE_EXPENSE}/:id`,
  isLoggedIn,
  deleteExpense
);
router.put(`${API_PATHS.EXPENSE.PUT_EXPENSE}/:id`, isLoggedIn, updateExpense);
router.get(
  `${API_PATHS.EXPENSE.GET_EXPENSE}/:date`,
  isLoggedIn,
  sendDayExpenses
);
router.post(
  `${API_PATHS.PSTORE_CART.POST_ITEMS_DATA_TO_CART}/items`,
  addItemsToCartApp
);

router.post("/api/purchaseOrder/getProductImage", getProductImageByProductName);

module.exports = router;
