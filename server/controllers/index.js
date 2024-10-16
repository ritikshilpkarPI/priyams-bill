const getStaff = require('./getStaff');
const addBulkItems = require('./addBulkItems');
const addDailyAttendanceArrival = require('./addDailyAttendanceArrival');
const addDailyAttendanceLeaving = require('./addDailyAttendanceLeaving');
const addItems = require('./addItems');
const addExpense = require('./addExpense');
const addNewBill = require('./addNewBill');
const addOpenCloseProcedure = require('./addOpenCloseProcedure');
const addOrder = require('./addOrder');
const addStaff = require('./addStaff');
const approveOrder = require('./approveOrder');
const deleteBill = require('./deleteBill');
const deleteExpense = require('./deleteExpense');
const deleteOrderItemById = require('./deleteOrderItemById');
const deletePaymentById = require('./deletePaymentById');
const deleteStaff = require('./deleteStaff');
const draftOrder = require('./draftOrder');
const editBill = require('./editBill');
const editItemById = require('./editItemById');
const editOpenCloseProcedure = require('./editOpenCloseProcedure');
const filterExpiryDates = require('./filterExpiryDates');
const getAllBill = require('./getAllBill');
const getAllProcedure = require('./getAllProcedure');
const getDateRangeReport = require('./getDateRangeReport');
const getDatesWiseAttendance = require('./getDatesWiseAttendance');
const getDayWiseBills = require('./getDayWiseBills');
const getDayWiseProcedures = require('./getDayWiseProcedures');
const getDetailsById = require('./getDetailsById');
const getEditBill = require('./getEditBill');
const getItemsCategoryList = require('./getItemsCategoryList');
const getItemsFeed = require('./getItemsFeed');
const getItemsWithNoImages = require('./getItemsWithNoImages');
const getMonthlyAttendance = require('./getMonthlyAttendance');
const getOrders = require('./getOrders');
const getOrdersByQuery = require('./getOrdersByQuery');
const getPurchaseOrderByItem = require('./getPurchaseOrderByItem');
const loginUser = require('./loginUser');
const logoutUser = require('./logoutUser');
const markAbsent = require('./markAbsent');
const permanentlyOutOfStock = require('./permanentlyOutOfStock');
const rejectOrder = require('./rejectOrder');
const saveInventory = require('./saveInventory');
const saveOrder = require('./saveOrder');
const savePayment = require('./savePayment');
const sendAllExpense = require('./sendAllExpense');
const sendDayExpenses = require('./sendDayExpenses');
const sendMessage = require('./sendMessage');
const softDeleteItem = require('./softDeleteItem');
const updateDetailsById = require('./updateDetailsById');
const updateExpense = require('./updateExpense');
const updateOrderByIndex = require('./updateOrderByIndex');
const updatePaymentById = require('./updatePaymentById');
const updateSavedOrders = require('./updateSavedOrders');
const updateSavedPayment = require('./updateSavedPayment');
const updateStaff = require('./updateStaff');
const userDetails = require('./userDetails');
const getCustomerBill = require('./getCustomerBill');
const getUserOrders = require('./getUserOrders');
const updateOrderStatus = require('./updateOrderStatus');
const getItemsLean = require('./getItemsLean');
const saveOrCacheBill = require('./saveOrCacheBill');
const getUnSavedBills = require('./getUnSavedBills');
const addItemsToCartApp = require('./addItemsToCartApp');
const getProductImageByProductName = require('./getProductImageByProductName');
const uploadImageCloudinary = require("./uploadImageCloudinary")
const getPurchaseOrderByPaidStatus = require('./getPurchaseOrderByPaidStatus');
const getPurchaseOrderById = require('./getPurchaseOrderById');
const payPurchaseOrderBill = require('./payPurchaseOrderBill');
const addExpiredItem = require('./addExpiredItem');
const getExpiredItems = require('./getExpiredItems');
const { addNewReturnBill } = require('./addNewReturnBill');
const { getBillForReturnExchange } = require('./getBillForReturnExchange');
const getItemsWithSelection = require('./getItemsWithSelection');
const getItemByBarcode = require('./getItemByBarcode');
const getItemsByFilter = require('./getItemsByFilter');

module.exports = {
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
  getItemsWithNoImages,
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
  getCustomerBill,
  getUserOrders,
  updateOrderStatus,
  getItemsLean,
  saveOrCacheBill,
  getUnSavedBills,
  addItemsToCartApp,
  getProductImageByProductName,
  uploadImageCloudinary,
  getPurchaseOrderByPaidStatus,
  getPurchaseOrderById,
  payPurchaseOrderBill,
  addExpiredItem,
  getExpiredItems,
  addNewReturnBill,
  getBillForReturnExchange,
  getItemsWithSelection,
  getItemByBarcode,
  getItemsByFilter
};
