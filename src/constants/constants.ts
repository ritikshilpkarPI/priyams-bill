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
    CASH: "cash",
    PREPAID: "prepaid",
    YES: "Yes",
    NO: "No",
    NO_IMAGE_AVAILABLE:'No Image Available',
    NO_PAYMENTS_AVAILABLE:'No Payments Available',
    NO_CREDITS_AVAILABLE:'No Credits Available',
    WAREHOUSE:"WAREHOUSE",
    STORE:"STORE",
    DEALER:"DEALER",
    TRANSACTION_REASON:{
        STOCK_DEFICIENCE:  "Stock Deficiency",
        RETURN_ON_EXPIRY: "Return On Expiry", 
        RETURN_ON_DAMAGE: "Return On Damage",
        VIRTULA_DAMAGE: "Virtual Damage",
        NEW_PURCHASE: " New Purchase",
        TRANSFER_OF_GOOD: "Transfer of Good",
        ERROR: "Error", 
        PACKAGING: "Packaging",
        QUANTITY_UPDATE: "QUANTITY_UPDATE" 
    },
    WAREHOUSE_COLLECTION_NAME: "pstr_1_462020_warehouse",
    NEW_ITEM: "NEW ITEM",

})

export const ITEM_EXPIRY_BATCH_ACTION = Object.freeze({
    APPROVE: "approve",
    REJECT: "reject",
    DRAFT: "draft",
    UPDATE: "update",    
})

export const ITEM_EXPIRY_BATCH_STATUS = Object.freeze({
    APPROVED: "APPROVED",
    DRAFTED: "DRAFTED",
    SAVED: "SAVED",
    CLEARED: "CLEARED",
})