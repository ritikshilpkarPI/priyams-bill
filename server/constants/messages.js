const MESSAGES = Object.freeze({
  INVALID_ID_FORMAT: 'Invalid ID format',
  PURCHASE_ORDER_NOT_FOUND: 'Purchase order not found',
  PURCHASE_ORDER_ITEM_FETCH_ERROR: 'Error fetching purchase order for item',
  NO_ITEMS_FOUND: 'No items found in purchase order',
  GET_ITEM_SOLD_SUCCESSFULLY: 'Get sold items successfully',
  UNEXPECTED_ERROR: 'An unexpected error occurred',
  BAD_REQUEST: 'Bad Request',
  NOT_FOUND: 'Not Found',
  MISSING_REQUIRED_FIELDS: 'Some required fields are missing',
  MISSING_FILTER_FIELD: 'Filter feild is missing',
  APPROVAL_TIME_MISSING: 'Approval time is missing for this purchase order',
});

module.exports = { MESSAGES };
