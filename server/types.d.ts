  interface creditsType {
    creditAmount?: number;
    payDate?: string;
    creditLimitInDays?: number;
    createdAt?: Date;
  }
  interface paymentsType {
    paymentDate?: string;
    paidBy?: string;
    paidAmount?: number;
    paymentImages?: Array<file>;
    paymentImgURL?: Array<{ public_id: string; secure_url: string }>;
    createdAt?: Date;
  }
  export interface purchaseDetailsType {
    totalPayableAmount?: number;
    totalBillAmount?: number;
    paymentType?: string;
    credits?: Array<creditsType>;
    payments?: Array<paymentsType>;
  }

  export interface StockChangeHistoryType {
    quantity: number;
    dateTime: Date;
    user: mongoose.Types.ObjectId;
    changeType: ChangeType;
    changedFrom: ChangedFrom;
  }
  
  export interface StoreInventoryItemType extends Document {
    itemId: mongoose.Types.ObjectId;
    itemQuantityInStore: number;
    itemStockChangeHistory: StockChangeHistoryType[];
  }


  export interface StoreType extends Document {
    storeAddress: {
      addressText: string;
      locality: string;
    };
    storePincode: string;
    storeContacts: string[];
    storeCode: string;
    storeNumber: number;
    storeCollectionName: string;
  }

