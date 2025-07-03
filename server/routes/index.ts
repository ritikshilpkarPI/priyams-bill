import express from "express";
import { isAdmin, isLoggedIn } from '../middleware/isAdmin';
import { API_PATHS } from '../../src/utils/constants/apiPaths';
import locationMiddleware from "../middleware/locationMiddleware";
import salesReportsRouter from './salesReports';
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
  getStaffByToken,
  addAllowedRoutesToStaff,
  removeAllowedRoutes,
  addAllowedRoutesToMultipleStaff,
  createExpiryItemsBatch,
  itemsStaticAttributes,
  updateStockTransactionDestination,
  updateStockTransactionByAdmin,
  addNewStockTransactions,
  itemPurchaseBatches,
  getItemsFromStoreInventory,
  getItemTransactions,
  getStockTransactions,
  getAllExpiryItemsBatch,
  getExpiryItemsBatchById,
  markExpiryItemsBatchCleared,
  bulkApproveStockTransactions,
  updateItemMismatchInStock,
  updateExpiryItemsBatch,
  draftExpiryItemsBatch,
  approveOrRejectExpiryItemsBatch,
  updateStockTransactionBySource,
  getDealerCatalog,
  getStockTransactionsByStatus,
  copyPurchaseOrder,
  copyStockTransaction,
  updateSellFrequency,
  checkLowStockAndCreateTransaction
} = require('../controllers/index');



// online order apis
router.get(API_PATHS.ORDERS.GET_USER_ORDERS, isLoggedIn, getUserOrders);
router.post(API_PATHS.ORDERS.UPDATE_USER_ORDERS, isLoggedIn, updateOrderStatus);
router.post(API_PATHS.ORDERS.CONFIRM_ORDER_PRODUCTS, isLoggedIn, confirmOrderProducts);
router.post(API_PATHS.ORDERS.EXPEL_ORDER_TO_RIDER, isLoggedIn, expelOrderToRider);

router.get(API_PATHS.INVENTORY.GET_ITEMS, isLoggedIn, getItemsFeed);
router.post(API_PATHS.SUBSCRIPTION, isLoggedIn, getSaveSubscription);
router.get(`${API_PATHS.INVENTORY.GET_ITEMS}/:itemBarcode`, isLoggedIn, getItemByBarcode);
router.post('/api/inventory/items/filter', isLoggedIn, getItemsByFilter);
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
  API_PATHS.OPENCLOSE.PUT_EDIT_PROCEDURE_CLOSE,
  isLoggedIn,
  editOpenCloseProcedure
);

router.put(
  API_PATHS.OPENCLOSE.PUT_EDIT_PROCEDURE_OPEN,
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

router.get(
  `${API_PATHS.PURCHASE_ORDER.COPY_PURCHASE_ORDER}/:id`,
  isLoggedIn,
  copyPurchaseOrder
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


router.get(API_PATHS.STAFF.GET_STAFF_BY_TOKEN, isLoggedIn, getStaffByToken);
router.post(API_PATHS.AUTH.POST_LOGIN, locationMiddleware, loginUser);
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



router.post(API_PATHS.EXPIRED_ITEM.ADD_EXPIRED_ITEM, isLoggedIn, addExpiredItem)
router.get(API_PATHS.EXPIRED_ITEM.GET_EXPIRED_ITEMS, isLoggedIn, getExpiredItems)


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

router.post(API_PATHS.INVENTORY.POST_TRANSFER_STOCK_TO_STORE, isLoggedIn, transferStockToStore);

router.get(API_PATHS.STORE.GET_ALL_STORES, isLoggedIn, getAllStores);
router.get(`${API_PATHS.STAFF.GET_STAFFS}/:storeId`, getStaffByStoreId);

router.get(API_PATHS.COMPANY.GET_ALL_COMPANY, isLoggedIn, getAllCompanies);

router.get(API_PATHS.BRAND.GET_ALL_BRAND, isLoggedIn, getAllBrands);

router.get(API_PATHS.ITEMS.GET_ITEM_PURCHASE_BATCHES, isLoggedIn, itemPurchaseBatches);
router.get(API_PATHS.STAFF.ADD_ROUTE_IN_STAFF, isLoggedIn, isAdmin, addAllowedRoutesToStaff);
router.get(API_PATHS.STAFF.ADD_BULK_ROUTE_IN_STAFF, isLoggedIn, isAdmin, addAllowedRoutesToMultipleStaff);
router.get(API_PATHS.STAFF.REMOVE_ROUTE_FROM_STAFF, isLoggedIn, isAdmin, removeAllowedRoutes);

router.get(API_PATHS.DEALER.GET_ALL_DEALERS, isLoggedIn, getAllDealers);

router.post(API_PATHS.DEALER.ADD_NEW_DEALER, isLoggedIn, addNewDealer);
router.post(API_PATHS.EXPIRED_ITEM.CREATE_EXPIRED_ITEMS_BATCH, isLoggedIn, createExpiryItemsBatch);
router.post(API_PATHS.STOCK_TRANSACTION.UPDATE_DESTINATION, isLoggedIn, updateStockTransactionDestination);

router.post(
  API_PATHS.STOCK_TRANSACTION.PUT_UPDATE_STOCK_TRANSACTION,
  isLoggedIn,
  updateStockTransactionByAdmin
);

router.get(`${API_PATHS.ITEMS.GET_ITEMS_STATIC_FIELDS}/:id?`, itemsStaticAttributes);


router.post(API_PATHS.STOCK_TRANSACTION.ADD_NEW_STOCK_TRANSACTION, isLoggedIn, addNewStockTransactions);
router.get(`${API_PATHS.STORE.GET_ITEMS_BY_STORE_ID}/:storeId`, isLoggedIn, getItemsFromStoreInventory);
router.post(API_PATHS.STOCK_TRANSACTION.GET_STOCK_TRANSACTIONS, isLoggedIn, getStockTransactions)
router.post(API_PATHS.STOCK_TRANSACTION.GET_ITEM_TRANSACTIONS, isLoggedIn, getItemTransactions)
router.get(`${API_PATHS.STOCK_TRANSACTION.COPY_TRANSACTION}/:id`, isLoggedIn, copyStockTransaction);
router.post(API_PATHS.STOCK_TRANSACTION.GET_STOCK_TRANSACTIONS_BY_STATUS, getStockTransactionsByStatus)

router.get(API_PATHS.EXPIRED_ITEMS_BATCH.GET_ALL_EXPIRED_ITEMS_BATCH, isLoggedIn, getAllExpiryItemsBatch);

router.get(`${API_PATHS.EXPIRED_ITEMS_BATCH.GET_EXPIRED_ITEMS_BATCH_BY_ID}/:id`, isLoggedIn, getExpiryItemsBatchById);

router.post(`${API_PATHS.EXPIRED_ITEMS_BATCH.MARK_EXPIRED_ITEMS_BATCH_CLEARED_BY_ID}/:id`, isLoggedIn, markExpiryItemsBatchCleared);

router.post(
  API_PATHS.STOCK_TRANSACTION.POST_BULK_APPROVE_STOCK_TRANSACTIONS,
  isLoggedIn,
  bulkApproveStockTransactions
);

router.post(API_PATHS.STOCK_TRANSACTION.MISMATCH_STOCK_TRANSACTION, isLoggedIn, updateItemMismatchInStock);
router.post(`${API_PATHS.EXPIRED_ITEM.UPDATE_EXPIRED_ITEMS_BATCH}/:id`, isLoggedIn, updateExpiryItemsBatch);
router.post(API_PATHS.EXPIRED_ITEM.DRAFT_EXPIRED_ITEMS_BATCH, isLoggedIn, draftExpiryItemsBatch);
router.post(API_PATHS.EXPIRED_ITEM.APPROVE_OR_REJECT_EXPIRED_ITEMS_BATCH, isLoggedIn, isAdmin, approveOrRejectExpiryItemsBatch);

router.post(API_PATHS.STOCK_TRANSACTION.UPDATE_STOCK_TRANSACTION_BY_SOURCE, isLoggedIn, updateStockTransactionBySource);

// Add sales reports route
router.use(API_PATHS.REPORT.POST_SALES_REPORTS, isLoggedIn, salesReportsRouter);

router.post(API_PATHS.DEALER_CATALOG , getDealerCatalog);

router.post(API_PATHS.STORE.UPDATE_SELL_FREQUENCY, updateSellFrequency);

router.post(API_PATHS.STORE.CHECK_LOW_STOCK_AND_CREATE_TRANSACTION, checkLowStockAndCreateTransaction);

export default router;
