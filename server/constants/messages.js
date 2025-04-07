const MESSAGES = Object.freeze({
  PURCHASE_ORDER_NOT_FOUND: 'Purchase order not found',
  NO_ITEMS_FOUND: 'No items found in purchase order',
  GET_ITEM_SOLD_SUCCESSFULLY: 'Get sold items successfully',
  UNEXPECTED_ERROR: 'An unexpected error occurred',
  BAD_REQUEST: 'Bad Request',
  NOT_FOUND: 'Not Found',
  MISSING_REQUIRED_FIELDS: 'Some required fields are missing',
  INVALID_PAYMENT_TYPE: "Invalid paymentType. Allowed values: Credit, PartiallyPaid, FullyPaid",
  PAYMENT_IMAGES_REQUIRED: "PaymentImages is required",
  ORDER_UPDATED_SUCCESSFULLY: "Order updated successfully",
  NO_CREDITS_FOUND: "No Cridits found",
  NO_PAYMENTS_FOUND: "No Payments found",
  CREDIT_NOT_FOUND: "Cridit not found",
  PAYMENT_NOT_FOUND: "Payment not found",
  PAYMENT_DELETED_SUCCESSFULLY: "Payment deleted successfully",
  LAT_LONG_REQUIRED: 'Latitude and longitude are required',
  PINCODE_FETCH_FAILED: 'Failed to retrieve pincode',
  STORE_NOT_FOUND: 'No store found for this pincode',
  INTERNAL_SERVER_ERROR: 'Internal server error',
  NO_STAFF_FOUND: "No staff found for this storeId"
});

module.exports = { MESSAGES };
