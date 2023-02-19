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

  // Open-Close Page
  CHECK_AMOUNT_ROW: ['admin'],

  // All Bills Page
  BILL_PROFIT_ROW: ['admin'],
  DELETE_BILL_ROW: ['admin'],
};

export default access;
