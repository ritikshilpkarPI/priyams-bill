export const CONSTANTS = Object.freeze({
    REJECT: "reject",
    APPROVE: "approve",
    DRAFT: "draft",
    CREDIT: "credit",
    PAYMENT: "payment",
    PARTIALLY_PAID: "partially paid",
    FULLY_PAID: "fully paid",
    NEFT: "neft",
    UPI: "upi",
    ADD: "ADD",
    WAREHOUSE: "WAREHOUSE",
    STATIC_FIELDS_TO_SELECT: "itemName itemMRPperUnit itemBarcode itemPerUnitQuantity quantityUnitName itemCategory subCategory itemBrandName companyName flavourOrFeature itemHasExpiry saleTime images sku itemShelfDates itemShelfDates ",
    REMOVE: "REMOVE",
    STORE: "STORE",
    DEALER: "DEALER",  
    IN: "IN",
    OUT: "OUT",
    STATUS:{
      PENDING: "pending",
      APPROVED: "approved"
    },
    QUANTITY_UPDATE: "QUANTITY_UPDATE",
    PURCHASE_ORDER_FIELDS_TO_SELECT: [
      '_id',
      'createdAt',
      'draftTime',
      'approveTime',
      'dateOnBill',
      'purchasedItems',
      'dealerName'
    ],
    WAREHOUSE_COLLECTION_NAME: "pstr_1_462020_warehouse",
    TRANSACTIONS_STATUS:{
      SOURCE_CREATED: "sourceCreated",
      DESTINATION_UPDATED: "destinationUpdated",
      APPROVED: "approved"
    }
})
