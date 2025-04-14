import express from "express";
import { isAdmin, isLoggedIn } from '../middleware/isAdmin';
import { API_PATHS } from '../../src/utils/constants/apiPaths';
import locationMiddleware from "../middleware/locationMiddleware";
const router = express.Router();
const {
  addBulkItems,
  addItems,
  addExpense,
  addOpenCloseProcedure,
  addOrder,
  deleteBill,
  deleteExpense,
  deleteOrderItemById,
  deletePaymentById,
  draftOrder,
  editItemById,
  editOpenCloseProcedure,
  filterExpiryDates,
  getAllBill,
  getDateRangeReport,
  getDayWiseBills,
  getDayWiseProcedures,
  getDetailsById,
  getCustomerBill,
  getItemsFeed,
  getOrdersByQuery,
  getPurchaseOrderByItem,
  loginUser,
  logoutUser,
  rejectOrder,
  saveInventory,
  saveOrder,
  sendAllExpense,
  sendDayExpenses,
  sendMessage,
  softDeleteItem,
  updateDetailsById,
  updateExpense,
  updateOrderByIndex,
  updatePaymentById,
  updateSavedOrders,
  getUserOrders,
  updateOrderStatus,
  getItemsLean,
  saveOrCacheBill,
  getProductImageByProductName,
  addExpiredItem,
  getExpiredItems,
  addNewReturnBill,
  getBillForReturnExchange,
  getItemByBarcode,
  getItemsByFilter,
  getSaveSubscription,
  getAllRiders,
  confirmOrderProducts,
  expelOrderToRider,
  assignOrderToRider,
  getItemsSellDetailsByPurchaseOrderId,
  getItemsSku,
  getItemById,
  getAllStaffs,
  transferStockToStore,
  getAllStores,
  getStaffByStoreId,
  getAllCompanies,
  getAllBrands,
  getAllDealers,
  addNewDealer,
  itemsStaticAttributes,
  updateStockTransactionSource
} = require('../controllers/index');



// online order apis
router.get(API_PATHS.ORDERS.GET_USER_ORDERS, isLoggedIn, getUserOrders);
router.post(API_PATHS.ORDERS.UPDATE_USER_ORDERS, isLoggedIn, updateOrderStatus);
router.post(API_PATHS.ORDERS.CONFIRM_ORDER_PRODUCTS,isLoggedIn, confirmOrderProducts);
router.post(API_PATHS.ORDERS.EXPEL_ORDER_TO_RIDER,isLoggedIn, expelOrderToRider);

router.get(API_PATHS.INVENTORY.GET_ITEMS, isLoggedIn, getItemsFeed);
router.post(API_PATHS.SUBSCRIPTION, isLoggedIn, getSaveSubscription);
router.get(`${API_PATHS.INVENTORY.GET_ITEMS}/:itemBarcode`, isLoggedIn, getItemByBarcode);
router.post(API_PATHS.INVENTORY.GET_ITEMS, isLoggedIn, getItemsByFilter);
router.get(
  API_PATHS.INVENTORY.GET_ITEMS_LEAN_FOR_BILLING,
  isLoggedIn,
  getItemsLean
);

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

router.get(`${API_PATHS.BILLING.GET_CUSTOMER_BILL}/:id`, getCustomerBill);
router.post(API_PATHS.BILLING.POST_SEND_MESSAGE, isLoggedIn, sendMessage);
router.delete(API_PATHS.BILLING.DELETE_BILL, isLoggedIn, deleteBill);
router.post(API_PATHS.BILLING.SAVE_OR_CACHE_BILL, isLoggedIn, saveOrCacheBill);
router.post(API_PATHS.BILLING.POST_RETURN_BILLS, isLoggedIn, addNewReturnBill);
router.get(`${API_PATHS.BILLING.GET_BILL}/:id`, isLoggedIn, getBillForReturnExchange);



router.post(
  `${API_PATHS.APPROVAL.POST_REJECT_ORDER}/:id`,
  isLoggedIn,
  isAdmin,
  isLoggedIn,
  rejectOrder
);


router.post(API_PATHS.AUTH.POST_LOGIN,locationMiddleware, loginUser);
router.get(API_PATHS.AUTH.GET_LOGOUT, isLoggedIn, logoutUser);

router.post(
  `${API_PATHS.REPORT.POST_GET_DATE_RANGE_REPORT}/:filterName`,
  isLoggedIn,
  getDateRangeReport
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
  '/api/purchaseOrder/getProductImage',
  isLoggedIn,
  getProductImageByProductName
);


router.post(
    `${API_PATHS.PURCHASE_ORDER.GET_ITEM_SOLD}/:id`,
    getItemsSellDetailsByPurchaseOrderId
  );


router.post(
  '/api/riders',
  isLoggedIn,
  isAdmin,
  isLoggedIn,
  getAllRiders
);



router.post(API_PATHS.EXPIRED_ITEM.ADD_EXPIRED_ITEM,isLoggedIn,addExpiredItem)
router.get(API_PATHS.EXPIRED_ITEM.GET_EXPIRED_ITEMS,isLoggedIn,getExpiredItems)


router.post( 
  API_PATHS.ORDERS.ASSIGN_ORDER_TO_RIDER,  
  isLoggedIn,
  isAdmin,
  isLoggedIn,
  assignOrderToRider
);

router.get(API_PATHS.ITEMS.GET_ITEMS_SKU, isLoggedIn, getItemsSku);

router.get(`${API_PATHS.ITEMS.GET_ITEM_BY_ID}/:id`, isLoggedIn, getItemById);

router.get(API_PATHS.STAFF.GET_STAFFS, isLoggedIn, getAllStaffs);

router.post(API_PATHS.INVENTORY.POST_TRANSFER_STOCK_TO_STORE,isLoggedIn, transferStockToStore);

router.get(API_PATHS.STORE.GET_ALL_STORES, isLoggedIn, getAllStores);
router.get(`${API_PATHS.STAFF.GET_STAFFS}/:storeId`, getStaffByStoreId);

router.get(API_PATHS.COMPANY.GET_ALL_COMPANY,isLoggedIn, getAllCompanies);

router.get(API_PATHS.BRAND.GET_ALL_BRAND,isLoggedIn, getAllBrands);

router.get(API_PATHS.DEALER.GET_ALL_DEALERS, isLoggedIn, getAllDealers);

router.post(API_PATHS.DEALER.ADD_NEW_DEALER, isLoggedIn, addNewDealer);
router.put(API_PATHS.STOCK_TRANSACTION.UPDATE_SOURCE, isLoggedIn, updateStockTransactionSource);


router.get(`${API_PATHS.ITEMS.GET_ITEMS_STATIC_FIELDS}/:id?`, itemsStaticAttributes);

export default router;
