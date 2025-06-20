export const API_PATHS = {
  PURCHASE_ORDER: {
    GET_ORDERS_BY_QUERY: '/api/purchaseOrder/getOrdersByQuery/',
    GET_INDIVIDUAL_PURCHASE_ORDER: '/api/purchaseOrder/individualPurchaseOrder',
    GET_ORDER_DETAILS: '/api/purchaseOrder/orderDetails',
    POST_DRAFT_ORDER: '/api/purchaseOrder/draftOrder',
    POST_ADD_NEW_ORDER: '/api/purchaseOrder/addNewOrder',
    POST_UPDATE_DETAILS: '/api/purchaseOrder/updateDetails',
    POST_SAVE_ORDER: '/api/purchaseOrder/saveOrder',
    POST_UPDATE_SAVED_ORDER: '/api/purchaseOrder/updateSavedOrder',
    POST_UPDATE_ORDER_BY_INDEX: '/api/purchaseOrder/updateOrderByIndex',
    POST_DELETE_ITEM: '/api/purchaseOrder/deleteItem',
    GET_ORDERS: '/api/purchaseOrder/orders',
    EXPIRED_ITEM: '/api/purchaseOrder/addExpiredProduct',
    GET_ITEM_SOLD:'/api/purchaseOrder/itemSold',
    COPY_PURCHASE_ORDER: '/api/purchaseOrder/copyPurchaseOrder',
  },
  SUBSCRIPTION:'/api/subscription',
  ATTENDANCE: {
    POST_DAILY_ATTENDANCE_ARRIVAL: '/api/attendance/dailyAttendanceArrival',
    POST_DAILY_ATTENDANCE_LEAVING: '/api/attendance/dailyAttendanceLeaving',
    POST_DAILY_ATTENDANCE: '/api/attendance/dailyAttendance',
  },
  BILLING: {
    GET_BILL_FEED: '/api/billing/getBillFeed',
    DELETE_BILL: '/api/billing/deleteBill',
    POST_SEND_MESSAGE: '/api/billing/sendMessage',
    POST_NEW_BILL: '/api/billing/newBill',
    GET_ALL_DAILY_BILLS: '/api/billing/allDailyBills',
    GET_CUSTOMER_BILL: '/api/billing/getCustomerBill',
    SAVE_OR_CACHE_BILL: '/api/billing/saveOrCacheBill',
    GET_UNSAVED_BILLS: '/api/billing/unSavedBills',
    POST_RETURN_BILLS: '/api/billing/returnBill',
    GET_BILL: '/api/billing/getBill',
  },
  INVENTORY: {
    POST_ADD_NEW_ITEM: '/api/inventory/addNewItem',
    POST_FILTER_EXPIRY_DATES: '/api/inventory/filterExpiryDates',
    POST_SAVE_INVENTORY: '/api/inventory/saveInventory',
    GET_ITEMS: '/api/inventory/items',
    POST_SOFT_DELETE_ITEM: '/api/inventory/softDeleteItem',
    POST_ADD_BULK_ITEMS: '/api/inventory/addbulkitems',
    PUT_EDIT_ITEM_BY_ID: '/api/inventory/editItemById',
    GET_ITEMS_LEAN_FOR_BILLING: '/api/inventory/getItemsLeanForBilling',
    POST_TRANSFER_STOCK_TO_STORE: '/api/inventory/transferStockToStore',
  },
  AUTH: {
    POST_LOGIN: '/api/auth/login',
    GET_LOGOUT: '/api/auth/logout',
  },
  OPENCLOSE: {
    GET_DAY_WISE_PROCEDURE: '/api/openClose/getDayWiseProcedure',
    POST_NEW_PROCEDURE_OPEN: '/api/openClose/newProcedure/open',
    PUT_EDIT_PROCEDURE_OPEN: '/api/openClose/editProcedure/open',
    POST_NEW_PROCEDURE_CLOSE: '/api/openClose/newProcedure/close',
    PUT_EDIT_PROCEDURE_CLOSE: '/api/openClose/editProcedure/close',
  },
  REPORT: {
    POST_GET_DATE_RANGE_REPORT: '/api/report/getDateRangeReport',
    POST_SALES_REPORTS: '/api/report/sales',
  },
  EXPENSE: {
    POST_EXPENSE: '/api/expense',
    GET_EXPENSE: '/api/expense',
    DELETE_EXPENSE: '/api/expense',
    PUT_EXPENSE: '/api/expense',
  },
  APPROVAL: {
    POST_REJECT_ORDER: '/api/approval/rejectOrder',
  },
  PAYMENT: {
    POST_UPDATE_SAVED_PAYMENT: '/api/payment/updateSavedPayment',
    POST_UPDATE_PAYMENT_BY_ID: '/api/payment/updatePaymentById',
    POST_DELETE_PAYMENT_BY_ID: '/api/payment/deletePaymentById',
  },
  STAFF: {
    GET_STAFFS: '/api/staffs',
    GET_STAFF: '/api/staff',
    POST_STAFF: '/api/staff',
    GET_STAFF_BY_TOKEN: '/api/staffByToken',
    ADD_ROUTE_IN_STAFF: '/api/staff/addRoutes',
    REMOVE_ROUTE_FROM_STAFF: '/api/staff/removeRoutes',
    ADD_BULK_ROUTE_IN_STAFF: '/api/staff/addRoutes/multiple',
  },
  ORDERS: {
    GET_USER_ORDERS: '/api/online/orders',
    UPDATE_USER_ORDERS: '/api/online/updateOrderStatus',
    CONFIRM_ORDER_PRODUCTS:'/api/online/confirmOrderProducts',
    EXPEL_ORDER_TO_RIDER:"/api/expelOrderToRider",
    ASSIGN_ORDER_TO_RIDER: "/api/order/assign-rider"
  },
  
  GOOGLE_IMAGE: {
    URL: "/api/purchaseOrder/getProductImage"
  },
  EXPIRED_ITEM: {
    ADD_EXPIRED_ITEM: "/api/addexpiredItem",
    GET_EXPIRED_ITEMS: "/api/getExpiredItems",
    CREATE_EXPIRED_ITEMS_BATCH: "/api/expiredItems/batch",
    UPDATE_EXPIRED_ITEMS_BATCH: "/api/expiredItems/batch",
    DRAFT_EXPIRED_ITEMS_BATCH: "/api/expiredItems/batch/draft",
    APPROVE_OR_REJECT_EXPIRED_ITEMS_BATCH: "/api/expiredItems/batch/approve-reject",
  },
 
  RIDER:{
    GET_ALL_RIDERS: "/api/riders"
  },
  ITEMS: {
    GET_ITEMS_SKU: "/api/items/sku",
    GET_ITEM_BY_ID: "/api/item",
    GET_ITEM_PURCHASE_BATCHES: "/api/itemPurchaseBatches",
    GET_ITEMS_STATIC_FIELDS: "/api/items/itemsStaticAttributes",
  },
  STORE: {
    GET_ALL_STORES: "/api/store",
    GET_ITEMS_BY_STORE_ID: '/api/store/inventory/items',
    GET_STORE_INVENTORY_MANAGEMENT: '/api/store/inventory',
    UPDATE_SELL_FREQUENCY: '/api/store/updateSellFrequency',
  },
  COMPANY:{
    GET_ALL_COMPANY: "/api/getAllCompany"
  },
  BRAND:{
    GET_ALL_BRAND: "/api/getAllBrand"
  },
  DEALER: {
    GET_ALL_DEALERS: "/api/dealer",
    ADD_NEW_DEALER: "/api/addNewDealer",
  },
  STOCK_TRANSACTION:{
    GET_ITEM_TRANSACTIONS:"/api/stockTransactions/items",
    PUT_UPDATE_STOCK_TRANSACTION: '/api/stockTransactions/:id/admin',
    ADD_NEW_STOCK_TRANSACTION: "/api/add-new-stock-transaction",
    UPDATE_DESTINATION: "/api/stockTransaction/updateDestination",
    GET_STOCK_TRANSACTIONS:"/api/stockTransactions",
    GET_STOCK_TRANSACTIONS_BY_STATUS:"/api/stockTransactions/status",
    UPDATE_STOCK_TRANSACTION_BY_DESTINATION: "/api/stockTransaction/updateStockTransactionByDestination",
    APPROVE_STOCK_TRANSACTION: "/api/stockTransaction/approveStockTransaction",
    POST_BULK_APPROVE_STOCK_TRANSACTIONS: "/api/stockTransaction/bulkApproveStockTransactions",

    MISMATCH_STOCK_TRANSACTION: "/api/stockTransactions/mismatch-correction" ,
    UPDATE_STOCK_TRANSACTION_BY_SOURCE: "/api/stockTransaction/updateStockTransactionBySource",
    COPY_TRANSACTION: "/api/stockTransaction/copyTransaction",
  },
  EXPIRED_ITEMS_BATCH: {
    GET_ALL_EXPIRED_ITEMS_BATCH: "/api/expiry-items-batch/getAllExpiryItemsBatch",
    GET_EXPIRED_ITEMS_BATCH_BY_ID: "/api/expiry-items-batch/getExpiryItemsBatchById",
    MARK_EXPIRED_ITEMS_BATCH_CLEARED_BY_ID: "/api/expiry-items-batch/markExpiryItemsBatchCleared",
    POST_ADD_EXPIRED_ITEMS_BATCH: "/api/expiry-items-batch/addExpiryItemsBatch",
  },
  DEALER_CATALOG: "/api/dealer-catalog",
};
