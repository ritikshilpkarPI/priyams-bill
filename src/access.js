const access = {
  // Routes Page
  SEGMENTED_BUTTON: {
    admin: [],
    manager: [],
  },
  DAY_BILL_ROUTE: ['admin'],

  REPORT_PAGE_ROUTE: ['admin'],
  // Inventory Page
  UPLOAD_CSV_BUTTON: ['admin'],
  DOWNLOAD_CSV_BUTTON: ['admin', 'manager'],
  UPDATE_ITEM_BUTTON_ITEM_ROW: ['admin'],

  // Open-Close Page
  CHECK_AMOUNT_ROW: ['admin'],

  // All Bills Page
  BILL_PROFIT_ROW: ['admin'],
  DELETE_BILL_ROW: ['admin'],
  OPEN_CLOSE_TABLE: ['admin'],
  PAY_PURCHASE_ORDER: ['admin'],
  APPROVED_PURCHASE_ORDER: ['admin'],
  STORE_INVENTORY_MANAGEMENT: ['admin'],
};

export default access;
