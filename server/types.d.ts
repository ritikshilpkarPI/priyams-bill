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
    dateTime?: Date;
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

export  interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}
  export type AuthenticatedRequest = {
    user?: {
      _id: ObjectId;
      name: string;
      username: string;
      role: string;
    };
  };

  export interface CompanyType extends Document {
    companyName: string;
  }
  
  export interface BrandType extends Document {
    brandName: string;
    companyId: Types.ObjectId;
  }
  
  export interface DealerType extends Document {
    dealerName: string;
    dealerBrands: Types.ObjectId[];
    dealerCompanies: Types.ObjectId[];
    dealerNumber: number;
  }
export interface TransactionSource {
  sourceStaff?: Types.ObjectId;
  sourceEntityId?: Types.ObjectId;
  sourceType?: string;
  sourceRemark?: string;
}

export interface TransactionDestination {
  destinationStaff?: Types.ObjectId;
  destinationEntityId?: Types.ObjectId;
  destinationType?: string;
  destinationRemark?: string;
}

export interface TransactionItemByDate {
  sourceQuantity: {
    expiryDate: Date;
    manufacturingDate: Date;
    qty: number;
  };
  destinationQuantity: {
    expiryDate: Date;
    manufacturingDate: Date;
    qty: number;
  };
  destinationRemark?: string;
  sourceRemark?: string;
  itemError?: {
    errorReason: string;
    errorQty?: number;
    isResolved: boolean;
  };
}


export interface TransactionItem {
  itemId: mongoose.Types.ObjectId;
  itemByDate: TransactionItemByDate[];
}

export interface StockTransactionType extends Document {
  transactionType: string;
  source: TransactionSource;
  destination?: TransactionDestination;
  transactionReason?: string;
  dateOfTransaction: Date;
  transactionStatus: string;
  hasErrors: boolean;
  approvedByAdmin: boolean;
  adminRemark?: string;
  isDeleted: boolean;
  transactionItems: TransactionItem[];
}

interface StatusHistory {
  status: string;
  staffId: mongoose.Types.ObjectId;
  dateTime: Date;
  browser: string;
  os: string;
  ipReferrer: string;
  statusChangeRemark: string;
}

interface ClearanceDetails {
  clearanceReason: string;
  clearedOn: Date;
  clearancePurchaseOrderId?: mongoose.Types.ObjectId;
  dealerId?: mongoose.Types.ObjectId;
  clearanceRemark: string;
}

interface ExpiredItems {
  itemId: mongoose.Types.ObjectId;
  expiryDate: Date;
  quantity: number;
  purchaseOrderId: mongoose.Types.ObjectId;
  costPricePerUnit: number;
  totalCostPrice: number;
}

export interface ItemWiseTotalCostType {
  itemId: mongoose.Types.ObjectId;
  itemTotalCost: number;
}
export interface ExpiredItemsSchema {
  boxId: string;
  dealerId: mongoose.Types.ObjectId;
  stockTransactionId: mongoose.Types.ObjectId;
  expiryImages: string[];
  expiryBatchCost: number;
  status: string;
  statusHistory: StatusHistory[];
  clearanceDetails?: ClearanceDetails;
  isCleared: boolean;
  items: ExpiredItems[];
  itemWiseTotalCost: ItemWiseTotalCostType[];
}