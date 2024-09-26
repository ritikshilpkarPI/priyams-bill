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
  },
  ATTENDANCE: {
    GET_MONTHLY_ATTENDANCE: '/api/attendance/monthlyAttendance',
    POST_MARK_ABSENT: '/api/attendance/markAbsent',
    POST_DAILY_ATTENDANCE_ARRIVAL: '/api/attendance/dailyAttendanceArrival',
    POST_DAILY_ATTENDANCE_LEAVING: '/api/attendance/dailyAttendanceLeaving',
    POST_DAILY_ATTENDANCE: '/api/attendance/dailyAttendance',
  },
  BILLING: {
    GET_BILL_FEED: '/api/billing/getBillFeed',
    DELETE_BILL: '/api/billing/deleteBill',
    POST_SEND_MESSAGE: '/api/billing/sendMessage',
    GET_EDIT_BILL: '/api/billing/getEditBill',
    PUT_EDIT_BILL: '/api/billing/editBill',
    POST_NEW_BILL: '/api/billing/newBill',
    GET_USER_DETAILS: '/api/billing/userDetails',
    GET_ALL_DAILY_BILLS: '/api/billing/allDailyBills',
    GET_CUSTOMER_BILL: '/api/billing/getCustomerBill',
    SAVE_OR_CACHE_BILL: '/api/billing/saveOrCacheBill',
    GET_UNSAVED_BILLS: '/api/billing/unSavedBills',
    POST_RETURN_BILLS: '/api/billing/returnBill',
  },
  INVENTORY: {
    POST_ADD_NEW_ITEM: '/api/inventory/addNewItem',
    POST_FILTER_EXPIRY_DATES: '/api/inventory/filterExpiryDates',
    POST_SAVE_INVENTORY: '/api/inventory/saveInventory',
    GET_ITEMS: '/api/inventory/items',
    POST_SOFT_DELETE_ITEM: '/api/inventory/softDeleteItem',
    POST_ADD_BULK_ITEMS: '/api/inventory/addbulkitems',
    PUT_EDIT_ITEM_BY_ID: '/api/inventory/editItemById',
    GET_PERMANENTLY_OUT_OF_STOCK: '/api/inventory/permanentlyOutOfStock',
    GET_ITEMS_CATEGORY_LIST: '/api/inventory/getItemsCategoryList',
    GET_ITEMS_WITH_NO_IMAGES: '/api/inventory/getItemsWithNoImages',
    GET_ITEMS_LEAN_FOR_BILLING: '/api/inventory/getItemsLeanForBilling',
  },
  AUTH: {
    POST_LOGIN: '/api/auth/login',
    GET_LOGOUT: '/api/auth/logout',
  },
  OPENCLOSE: {
    GET_ALL_PROCEDURE: '/api/openClose/getAllProcedure',
    GET_DAY_WISE_PROCEDURE: '/api/openClose/getDayWiseProcedure',
    POST_NEW_PROCEDURE_OPEN: '/api/openClose/newProcedure/open',
    PUT_EDIT_PROCEDURE_OPEN: '/api/openClose/editProcedure/open',
    POST_NEW_PROCEDURE_CLOSE: '/api/openClose/newProcedure/close',
    PUT_EDIT_PROCEDURE_CLOSE: '/api/openClose/editProcedure/close',
  },
  REPORT: {
    POST_GET_DATE_RANGE_REPORT: '/api/report/getDateRangeReport',
  },
  EXPENSE: {
    POST_EXPENSE: '/api/expense',
    GET_EXPENSE: '/api/expense',
    DELETE_EXPENSE: '/api/expense',
    PUT_EXPENSE: '/api/expense',
  },
  APPROVAL: {
    POST_REJECT_ORDER: '/api/approval/rejectOrder',
    POST_APPROVE_ORDER: '/api/approval/approveOrder',
  },
  PAYMENT: {
    POST_SAVE_PAYMENT: '/api/payment/savePayment',
    POST_UPDATE_SAVED_PAYMENT: '/api/payment/updateSavedPayment',
    POST_UPDATE_PAYMENT_BY_ID: '/api/payment/updatePaymentById',
    POST_DELETE_PAYMENT_BY_ID: '/api/payment/deletePaymentById',
  },
  STAFF: {
    GET_STAFF: '/api/staff',
    POST_STAFF: '/api/staff',
    PUT_STAFF: '/api/staff',
    DELETE_STAFF: '/api/staff',
  },
  ORDERS: {
    GET_USER_ORDERS: '/api/online/orders',
    UPDATE_USER_ORDERS: '/api/online/updateOrderStatus',
  },
  PSTORE_CART: {
    POST_ITEMS_DATA_TO_CART: '/api/cart'
  },
  GOOGLE_IMAGE:{
     URL: "/api/purchaseOrder/getProductImage"
  }
  ,
  EXPIRED_ITEM:{
    ADD_EXPIRED_ITEM: "/api/addexpiredItem",
    GET_EXPIRED_ITEMS: "/api/getExpiredItems"
 }
};
