import mongoose, { ObjectId } from "mongoose";
import { store } from "./redux/store";
import { RefObject } from "react";
import { NumberValue } from "d3";
import { GridEventListener } from "@mui/x-data-grid";

declare global {

  interface StoreDataType {
    name: string;
    number: string;
    pincode: string;
  };

  interface StoreDataType {
    name: string;
    number: string;
    pincode: string;
    _id?:string;
  };
  export interface UserStateType {
    isGeolocationPermissionGranted: boolean;
    userDeviceLocation?: DeviceLocationType;
    storeData: StoreDataType;
  }

  export type RootState = ReturnType<typeof store.getState>;

 

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export interface ApiCallParams<T = any> {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    path: string;
    data?: T;
    headers?: Record<string, string>;
  }

  export interface SaveBillAPIDataType {
    billId?: string;
  }

  

  interface soldItemsByDateInterface {
    date: string;
    value: number;
  }

  interface LineGraphProps {
    data: soldItemsByDateInterface[];
    width: number;
    height: number;
  }
  interface IntervalInterface {
    startDate: string;
    endDate: string;
    timePeriod: string; 
    data: soldItemsByDateInterface[];
  }
  interface ItemSoldPurchaseOrder {
    orderSequence: string;
    approvalDate: string;
    amount: number;
    costPrice: number;
    purchaseOrderId: string;
  }

  interface ItemSoldInterface {
    itemId: string;
    itemName: string;
    itemMRP: number;
    soldAfterApproval: number;
    intervals: IntervalInterface[];
    lastPurchaseOrders: ItemSoldPurchaseOrder[];
    lastMonthSold?: number;
    lastThreeMonthSold?: soldItemsByDateInterface[];
    lastYearSold?: soldItemsByDateInterface[];
  }

  interface SellDetailsTableProps {
    tableData: ItemSoldInterface[];
    currentDate?: string;
    lastThreeMonthDate?: string;
    lastYearDate?: string;
    isPODetailsPage?: boolean;
  }

 
 
  
  interface PaymentDetailsSchemaInterface {
    paymentType?: 'Cash' | 'Cheque' | 'UPI' | 'NEFT'; 
    paymentAmount?: number; 
    purchaseOrderReference?: mongoose.Types.ObjectId; 
    dealerReference?: mongoose.Types.ObjectId; 
    paymentRemarks?: string; 
    paymentProofImage?: {  publicId: String , secureUrltype: String }; 
  }
  interface LastPurchaseOrderTableProps {
    lastPurchaseOrders: ItemSoldPurchaseOrder[];
    isDropdown?: boolean;
  }
  interface Product {
    id: string;
    name: string;
    mrp: number;
    packetQty: number;
    unit: string;
    barcode: string;
  }

  export interface ItemNameSKUProps {
    itemName: string;
    barcode: string;
    mrp: number;
    packetQty: number;
    packetUnit: string;
  }

 
 
  interface IntervalPropInterface {
    startDate: string;
    endDate: string;
    timePeriod: string;
  }
   interface BillItem {
    itemDetail: {
      _id: string;
      itemName: string;
      itemMRPperUnit: number;
      itemSellingPricePerUnit: number;
      itemBarcode: string;
      itemStockQuantity: number;
      slabPricing?: [number, number, number][];
      itemImageUrl?: string;
    };
    itemQuantityInBill: number;
  }
  
  
   interface BillState {
    billItems: BillItem[];
    customerName: string;
    customerPhone: string;
    billMRPTotal: number;
    billAmountTotal: number;
    billDiscountTotal: number;
    totalNumberOfItems: number;
    totalNumberOfUniqueItems: number;
    totalBillProfit: number;
    cashPay: number;
    upiPay: number;
    amountReturn: number;
    billId: string;
    staffId: string;
  }
  interface SearchItem {
    _id: string;
    itemName: string;
    itemBarcode?: string;
  };
  interface AllItemsFeedData {
    itemBarCodesList: number[];
    itemNamesList: string[];
    itemsBarCodeMap: Record<string, number[]>;
    itemsNameMap: Record<string, object>;
    totalItemsCount: number;
  }
  
  interface AllItemsFeedDataState {
    itemsFeedData: AllItemsFeedData;
    itemsFeedAPILoading:boolean;
  }
  interface SidebarRefs {
    inputElem: RefObject<HTMLInputElement>;
    profile: RefObject<HTMLDivElement>;
    mainContainer: RefObject<HTMLDivElement>;
    sidebarElem: RefObject<HTMLDivElement>;
    liItem: RefObject<HTMLDivElement[]>;
  }

 
 
  
   

  interface DealerDetailFormType {
    payment: 'Fully Paid' | 'Partially Paid' | 'Credit';
    billAmount: number;
    procurementSource: 'Walmart' | 'D Mart' | 'City' | 'Distributor';
    dealerName: string;
    phoneNumber: string;
    remark: string;
    dealerId: string;
  };

  

  interface PurchasedItemDetailFormType {
    barcode: string;
    inputName: string;
    mrp: number;
    itemQuantity: number;
    unit: string,
    itemRemark: string;
    sellingPrice: number;
    costPrice: number;
    validate: false;
    item_id: string;
    brand: string;
    category: string;
    subCategory: string;
    flavourOrFeature: string;
    companyName: string;
    saleTime: string;
    expiryDates: ItemExpiryDateType[];
    slabPrice: [];
    stockQuantity: number;
    returnPolicyAvailable: boolean;
    freeItemsAvailable: boolean;
    returnPolicyRemarks: string;
    _id?: string;
    inputName?: string;
    freeItemsRemarks?: string;
    itemHasExpiry?: boolean | null;
    profitPercentage: number;
    brandId: {
      brandName: string;
      brandId: string;
    };
    companyId: {
      companyName: string;
      companyId: string;
    };
    newItem?: boolean;
    barcodeImages?: []
    itemNameImages?: []
    unitImages?: []
    mrpImages?: []
    packetQtyImages?:[]
    costPriceImages?:[]
    sellingPriceImages?: []
    stockQuantityImages?:[]
  }

  interface PurchasedItemDetailFormProps {
    onSubmit: (purchasedItemFormData: PurchasedItemDetailFormType) => void;
    loading?: boolean;
    isApprovedPO?: boolean;
    onItemSelect: (item: { itemDetail: BillLeanItemType }) => void;
  }

  interface ItemExpiryDateType {
    value: number;
    mfgDate: Date;
    date: Date;
    images?: CloudImage[];
  }

  interface ItemExpiryTableProps {
    expiryDates: ItemExpiryDateType[],
    onRemove?: any;
    showActions?: boolean;
    showTotal?: boolean;
  }
  interface creditsType {
    creditAmount?: number;
    payDate?: string;
    creditLimitInDays?: number;
    createdAt?: Date;
  }
  interface paymentsType {
    paymentDate?: string;
    paidBy?: string;
    paymentImages?: Array<file>;
    paymentImgURL?:Array<{ public_id:string, secure_url:string }>;
    paidAmount?: number;
    createdAt?: Date;
    chequeNumber?:string;
    idx?: number;
  }
  interface PaymentDetailType {
    totalPayableAmount?: number;
    totalBillAmount?: number;
    paymentType?: string;
    totalItemsCost?: number;
    remark?: string;
    addPaymentDetail?:  paymentsType;
    addCreditDetail?: creditsType;
    credits?:Array<creditsType>;
    payments?:Array<paymentsType>;
    paymentFormState?:{
      addCredit?:boolean
      makePayment?:boolean
    }
  }

  interface CloudFileType {
    public_id: string;
    secure_url: string;
  }
  export interface StatusHistoryDataType {
    userId?: string;
    status?: 'draft' | 'reject' | 'approve'; 
    browser?: string;
    os?: string;
    ipAddress?: string;
    referer?: string;
    rejectMessage?: string;
  }
  
  export interface StatusHistoryItemType {
    _id: string;
    createdAt: string;
    data?: StatusHistoryDataType;
  }
  
  
  interface PurchaseOrderDataType {
    isApproved?: boolean;
    isRejected?: boolean;
    isDraft?: boolean;
    isPaid?: boolean;
    totalPaidAmount?: number;
    createdAt?: string;
    _id?: string ;
    purchasedItems?: Array<PurchasedItemDetailFormType>;
    purchaseDetails?: PaymentDetailType;
    billPhotos?: Array<CloudFileType>;
    dealerName?: string;
    phoneNumber?: string;
    billAmount?: number;
    payment?: string;
    procurementSource?: string;
    remark?: string;
    dateOnBill?: Date | null;
    statusHistory?: StatusHistoryItemType[];
  }

  interface PurchasedItemTableProps {
    onRemove: (purchasedItem: PurchasedItemDetailFormType, idx: number) => void;
    onEdit: (purchasedItem: PurchasedItemDetailFormType, idx: number) => void; 
    loadingRemoveItemById: string;
    isApprovedPO?: boolean;
  }

 

  interface PaymentDetailFormProps {
    purchaseOrderId?: string;
    paymentDetailIdx?: number;  
  }

  interface QuestionModalProps {
    opened: boolean;
    onClose: () => void;
    question: string;
    onAgree: () => void;
    onDisagree: () => void;
    children?: React.ReactNode;
    isChangeCTADisabled?: boolean;
  }

  interface CustomNumberInputProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: number;
    label?: string;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
  }



  interface UpdateDetailBillUploadArgs {
    bills?: Array<string>;
    deleteBills?: Array<CloudFileType>;
    uploadedImages?: Array<CloudFileType>;
  }

  type YupValidationErrorMapType = Record<string, string>;

  interface BillLeanItemType {
    _id: string;
    itemBarcode: string;
    itemName: string;
  }

  interface PurchaseObjType extends PurchaseOrderDataType {
    orders?: Array<PurchasedItemDetailFormType>;
    bills?: Array<string>;
    details?: PaymentDetailType;
  }
 
  interface AddNewOrderAPIArgs {
    new_order: {
      purchaseObj: PurchaseObjType,
    }
  }

  interface UpdateOrderAPIArgs {
    new_order: {
      purchaseObj: PurchaseObjType,
      id: string;
    },
    deleteBills?: Array<CloudFileType>;
    uploadedImages?: Array<CloudFileType>;
  }
  interface PaymentsList {
    creditAmount?: number;
    payDate?: string;
    paymentDate?: string;
    paidBy?: string;
    paidAmount?: number;
    paymentImages?: File[];
    paymentImgURL?:Array<{ public_id:string, secure_url:string }>;
    creditLimitInDays?: number;
    idx?: number;
    _id?: string;
  }
  interface PaymentDetailsFormCardProps {
    removePaymentRecord: (paymentId: string) => Promise<{ isError: boolean, error?:string }>;
    paymentsList: Array<PaymentsList>;
    title: string
  }




  interface MetricCardProps {
    title: string;
    value: string | number;
    prefix?: string;
    suffix?: string;
  }
  
  interface PaymentDetailsCardProps {
    payment: PaymentsList;
    index: number;
    removePaymentRecord: (paymentId: string) => Promise<{isError: boolean, error?:string}>;
  }
  interface PurchaseOrderProps {
    isApprovedPO?: boolean;
  }

  interface WarehouseItem {
    _id?: string;
    itemName?: string;
    itemBarcode?: string;
    itemMRPperUnit?: number;
    itemSellingPricePerUnit?: number;
    itemStockQuantity?: number;
    slabPricing?: [number, number, number][];
    itemQtyInStore?:number;
    itemStockQuantity?:number;
    itemShelfDates?: ItemShelfDate[];
    sku?: string;
  }

  interface StoreInventoryItem extends WarehouseItem {
    quantityToAdd: number;
  }
  interface ItemShelfDate {
    _id:string;
    expiryDate: string; 
    manufacturingDate: string; 
    quantity: number;
    purchaseOrderId: string;
    entryDate: string;
    quantityToAdd: number; 
    currentStockQuantity: number;
  }
  interface TransactionSource {
    sourceStaff?: Types.ObjectId;
    sourceEntityId?: Types.ObjectId;
    sourceType?: string;
    sourceRemark?: string;  
  }
  interface TransactionDestination {
    destinationStaff?: Types.ObjectId;
    destinationEntityId?: Types.ObjectId;
    destinationType?: string;
    destinationRemark?: string;
  }
  interface TransactionItemByDate {
    shelfId:string
    sourceQuantity: {
      expiryDate: string;
      manufacturingDate: string;
      qty: number;
      quantity: number;
    };
    destinationQuantity?: {
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
    statusMessage?: string;
  }
  interface TransactionItemType {
    itemId: string;
    itemBarcode: string;
    itemMRPperUnit: number;
    itemName: string;
    itemQtyInStore: number;
    itemStockQuantity:number;
    itemSellingPricePerUnit: number;
    itemByDate: TransactionItemByDate[];
    itemShelfDates: ItemShelfDate[];
    totalQtyAdd: number;
    sku: string;
    destinationRemark?: string;
    sourceRemark?: string;
    error?: any;
  }
  interface StockTransactionType {
  transactionType: string;
  source: TransactionSource;
  destination: TransactionDestination;
  transactionReason?: string;
  dateOfTransaction: Date | string;
  transactionStatus: string;
  hasErrors: boolean;
  approvedByAdmin: boolean;
  adminRemark?: string;
  isDeleted: boolean;
  transactionItems: TransactionItemType[];
  sourceTypeData: any[];
  destinationTypeData: any[];
}
  interface Store {
    _id: string;
    name: string;
    code: string;
    type: string
  }

  interface StoreInventoryForm {
    storeId: string;
    items: StoreInventoryItem[];
  }
  interface StoreInventoryState {
    selectedStoreId: string;
    inventoryItems: any[];
  }
  interface ItemWithQuantity {
    itemDetail: WarehouseItem;
    itemQuantityInBill: number;
  }
  interface DeviceLocationType {
    latitude?: number;
    longitude?: number;
  }
  interface Brand {
    _id: string;
    brandName: string;
    companyId: string;
  }
  interface BrandState {
    brands: Brand[];
    loading: boolean;
    error: string | null;
  }
  interface company {
    _id: string;
    companyName: string;
  }
  interface companyState {
    companys: company[];
    loading: boolean;
    error: string | null;
  }
  type BrandSelectorProps = {
    align?: string;
    label?: string;
    value: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    disabled?: boolean;
  };
  type CompanySelectorProps = {
    align?: string;
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    disabled?: boolean; 
  };
  interface StaffInterface {
    _id?: string;
    name?: string;
    username?: string;
    role?: string;
  }
  interface StaffSliceInterface {
    staffs: Staff[]; 
    loading: boolean;
  } 
  interface StaffSelectDropdownInterface {
    error?: string;
    onChange: (value: string) => void; 
    label?: string;
    selectedStaffId?: string;
    disabled?:boolean;
    storeId?:string;
  }
  interface ExpiredItem {
    itemName: string;
    itemBarcode: string;
    itemMRPperUnit: number;
    itemCostPricePerUnit: number;
    itemSellingPricePerUnit: number;
    mfgDate: string;
    expiryDate: string;
    expiryQuantity: number;
    _id:string
  }
  interface Dealer {
    _id?: string;
    dealerName: string;
    dealerBrands: string[];
    dealerCompanies: string[];
    dealerNumber: number;
  }
  interface DealerState {
    dealers: Dealer[];
    loading: boolean;
    error: string | null;
    selectedDealerId?: string;
  }
  
  interface ExpiredItemsState {
    items: ExpiredItem[];
    isLoading: boolean;
    startDate: Date;
    endDate: Date;
    order: 'asc' | 'desc';
    orderBy: string;
    page: number;
    rowsPerPage: number;
  }

  type Order = 'asc' | 'desc';

  interface Column {
    label: string;
    key: string;
    sortable?: boolean;
    render?: (row: any,index?: number) => React.ReactNode;
    flex?: number; 
    minWidth?: number;
    cellClassName?: string;
  }
  
  interface DataTableProps {
    columns: Column[];
    data: any[];
    isLoading: boolean;
    order?: 'asc' | 'desc';
    orderBy?: string;
    onSort?: (columnKey: string) => void;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    rowCount: number;
    paginationMode?: 'client' | 'server'; 
    onRowClick?: GridEventListener<'rowClick'>;
    expandedRows?: string[];
    onToggleExpand?: (id: string) => void; 
    onSelectionModelChange?: (selectionModel: GridRowSelectionModel) => void;
  }
  interface PurchaseListApprovalProps {
    allPurchaseList: any[];
    approveOrder: (id: string) => void;
    rejectOrder: (id: string) => void;
    makeDraft: (id: string) => void;
    loading: boolean;
  }
  interface LoadingState {
    [key: string]: { state: boolean; btnName: string } | undefined;
  }
  interface PurchaseListApprovalProps {
    allPurchaseList: PurchaseOrderDataType[];
    loading?: boolean;
    getOrders?: (type: string) => void;
  }
  
  interface PurchaseListApprovalState {
    allPurchaseList: PurchaseOrderDataType[];
    loadingState: LoadingState;
    order: 'asc' | 'desc';
    orderBy: string;
    page: number;
    rowsPerPage: number;
    indexDetail: number | null;
    isAdminUser: boolean;
  }
  interface RenderActionsProps {
    list: any ;
    index: number;
    isAdminUser: boolean;
    isApprovedPO: boolean;
    isSavedApprovedPage: boolean;
    loadingState: LoadingState; 
    draftOrder: (id: string, index: number) => void;
    approveOrder: (id: string, index: number, list: any) => void;
    rejectOrder: (id: string, index: number) => void;
    navigate:any
  };


  interface ExpiryBatch {
    isShelfExpired: boolean;
    purchaseOrderId: string;
    quantityToAdd?: number;
    expiryDate: string;
    manufacturingDate: string;
    quantity: number;
    _id: string;
    currentStockQuantity: number;
    initialStockQuantity: number;
  }
  
  interface InventoryItem {
    _id: string;
    itemDetail: {
      _id: string;
      itemName: string;
      itemBarcode: string;
      itemStockQuantity: number;
      itemShelfDates?: ExpiryBatch[];
      itemQtyInStore?: number;
    };
    quantityToAdd: number; 
  }
  
  interface InventoryItemPanelProps {
    items: TransactionItemType[];
    onQuantityChange: (
      itemId: string,
      quantity: number,
      shelfId?: string 
    ) => void;
    onRemoveItem: (itemId: string) => void;
    enableDestinationForm?: boolean;
    disabled?: boolean;
    isSourceStaff?: boolean;
  }
  interface ShelfLifeInfoProps {
    expiryDate: {
      mfgDate: string | Date;
      date: string | Date;
    };

  }
  interface Shelf {
    _id: string;
    purchaseOrderId?: string;
    entryDate: string;
    manufacturingDate: string;
    expiryDate: string;
    initialStockQuantity: number;
    currentStockQuantity: number;
    costPrice?: number;
  }
  
  interface ShelfTableProps {
    shelfList: TransactionItemByDate[];
    itemId: string;
    handleQuantityChange: (
      itemId: string,
      shelfQuantity: number,
      newQuantity: number,
      shelfId: string
    ) => void;
    showNewExpiryForm?: boolean
  }
  
  
  interface Brand {
    _id: string;
    brandName: string;
    companyId: string;
  }
  interface BrandState {
    brands: Brand[];
    loading: boolean;
    error: string | null;
  }
  interface company {
    _id: string;
    companyName: string;
  }
  interface companyState {
    companys: company[];
    loading: boolean;
    error: string | null;
  }
  type BrandSelectorProps = {
    label?: string;
    value: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
    disabled?: boolean;
  };
  type CompanySelectorProps = {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
    error?: string;
    disabled?: boolean; 
  };
  interface Dealer {
    _id?: string;
    dealerName: string;
    dealerBrands: string[];
    dealerCompanies: string[];
    dealerNumber: number;
  }
  interface DealerState {
    dealers: Dealer[];
    loading: boolean;
    error: string | null;
    selectedDealerId?: string;
  }
  type DealerOption = {
    value: string;
    label: string;
  };

  interface TransactionItem {
    itemId: {
      _id: string;
      itemName: string;
      itemMRPperUnit: string;
    };
    transactionItems: any[];
  }
  
  interface SourceDestination {
    sourceType?: string;
    sourceRemark?: string;
    sourceStaff?: { name: string };
    destinationType?: string;
    destinationRemark?: string;
    destinationStaff?: { name: string };
  }
  
  interface Transaction {
    _id: string; 
    transactionType: string;
    transactionItems: TransactionItem[];
    source?: SourceDestination;
    destination?: SourceDestination;
    transactionReason: string;
    transactionStatus: string;
    hasErrors: boolean;
    approvedByAdmin: boolean;
    adminRemark: string;
    dateOfTransaction: string;
  }
  
  type RawData = Transaction[]; 

  interface TransformedRow {
    _id: string;
    isSubRow: boolean;
    transactionId?: string;
    itemId?: string;
    itemName?: string;
    price?: string;
    transactionType?: string;
    sourceType?: string;
    sourceRemark?: string;
    sourceStaff?: string;
    destinationType?: string;
    destinationRemark?: string;
    destinationStaff?: string;
    transactionReason?: string;
    transactionStatus?: string;
    hasErrors?: string;
    approvedByAdmin?: string;
    adminRemark?: string;
    dateOfTransaction?: string;
    sourceExpiry?: string;
    sourceMfg?: string;
    qty?: string;
    destinationQty?: string;
    destinationExpiry?: string;
    destinationMfg?: string;
    ItemSourceRemark?: string;
    ItemDestinationRemark?: string;
    itemError?: string;
  }
  
  
  type TransformedData = TransformedRow[];
  
  interface TransactionState {
    rawData: Record<string, any[]>; 
    transformedData: TransformedData;
    expandedRows: string[];
    isLoading: boolean;
    page: number;
    rowsPerPage: number;
    startDate:Date;
    endDate:Date;
    totalCount: number;
  }
  interface DateRangePickerProps {
    startDate: Date | null;
    endDate: Date | null;
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
  };
  interface StockTransactionParams  {
    startDate?: Date;
    endDate?: Date;
    storeId?: string;
    storeIds?: string[];
    page?: number;
    limit?: number;
    itemIds?: string[];
  };
  

  interface ExpiryImage {
    publicId: string;
    secureUrl: string;
  }
  
   interface ExpiryStatusHistory {
    status: string;
    staffId: string;
    dateTime: string;
    browser?: string;
    os?: string;
    ipReferrer?: string;
    statusChangeRemark?: string;
  }
  
  interface ExpiryClearanceDetails {
    clearanceReason?: string;
    clearedOn?: string;
    clearancePurchaseOrderId?: string;
    dealerId?: string;
    clearanceRemark?: string;
  }
  
  interface ExpiryDealerIdType {
    _id: string;
    dealerName: string;
    dealerBrands: string[];
    dealerCompanies: string[];
    dealerNumber: number;
    createdAt: string;
    updatedAt: string; 
    __v: number;
  }
  
  interface ExpiryItemIdType{
    minimumStockQuantity: number;
    itemPerUnitDiscountPercentage: number;
    slabPricing: any[]; 
    minStockReached: boolean;
    returnPolicyAvailable: boolean;
    freeItemsAvailable: boolean;
    _id: string;
    itemBarcode: string;
    itemName: string;
    itemPerUnitQuantity: number;
    quantityUnitName: string;
    itemMRPperUnit: number;
    itemCostPricePerUnit: number;
    itemSellingPricePerUnit: number;
    itemBrandName: string;
    itemCategory: string;
    subCategory: string;
    itemStockQuantity: number;
    companyName: string;
    flavourOrFeature: string;
    isDeleted: boolean;
    sku: string;
    itemDiscountPerUnit: number;
    saleTime: string;
    permanentlyOutOfStock: boolean;
    __v: number;
    createdAt: string; 
    updatedAt: string; 
    brandId: string;
    useByDate: string[];
    images: string[];
    itemShelfDates: string[]; 
    expiryDates: string[];
  }
  
  interface ExpiryItemType {
    itemId: ExpiryItemIdType;
    expiryDate?: string;
    quantity: number;
    purchaseOrderId?: string;
    costPricePerUnit?: number;
    totalCostPrice?: number;
    manufacturingDate?: string;
  }
  
  interface ExpiryItemWiseTotalCost {
    itemId: ExpiryItemIdType;
    itemTotalCost: number;
  }
  
  interface ExpiredItem {
    _id: string;
    boxId: string;
    dealerId: ExpiryDealerIdType;
    stockTransactionId?: string;
    expiryImages: ExpiryImage[];
    expiryBatchCost?: number;
    status: string;
    statusHistory: ExpiryStatusHistory[];
    clearanceDetails?: ExpiryClearanceDetails;
    isCleared?: boolean;
    items: ExpiryItemType[];
    itemWiseTotalCost: ExpiryItemWiseTotalCost[];
    createdAt: string;
    updatedAt: string;
  }
  
  interface ExpiredItemsStateType {
    data: ExpiredItem[];
    loading: boolean;
    error: string | null;
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
      total: number;
    };
  }
  interface ExpiryItemsQueryParams {
    page?: number;
    limit?: number;
    dealerId?: string;
    purchaseOrderId?: string;
    itemId?: string;
    clearanceReason?: string;
    status?: string;
    expiryDateFrom?: string;
    expiryDateTo?: string;
    manufacturingDateFrom?: string;
    manufacturingDateTo?: string;
    createdAtFrom?: string;
    createdAtTo?: string;
  }

  interface StoreInventoryItemShelfDateType {
    expiryDate: string;
    manufacturingDate: string;
    quantity: number;
    purchaseOrderId: string;
    entryDate: string;
    currentStockQuantity: number;
    initialStockQuantity: number;
    _id: string;
    updateQuantity: number;
  }
  
  interface StoreInventoryItemType {
    _id: string;
    itemBarcode: string;
    itemName: string;
    itemPerUnitQuantity: number;
    quantityUnitName: string;
    itemMRPperUnit: number;
    itemBrandName: string;
    itemCategory: string;
    subCategory: string;
    companyName: string;
    flavourOrFeature: string;
    saleTime: string;
    images: string[];
    itemShelfDates: StoreInventoryItemShelfDateType[];
  }
  
  interface StoreInventoryStateType {
    items: StoreInventoryItemType[];
    itemCount: number;
    selectedStoreId: string | null;
    stores: any[];
    selecteditem: StoreInventoryItemType | null;
    isLoading: boolean;
    selectedItemsIds: string[];
  }

  interface InventoryPurchaseOrderEntry {
    purchaseOrderId: string;
    approveTime: string;
    draftTime: string;
    costPrice: number;
    sellingPrice: number;
    mrp: number;
  }
  interface InventoryPurchaseOrderItemShelfDate {
    _id?: string;
    purchaseOrderId: string;
    expiryDate: string;
    manufacturingDate: string;
    initialStockQuantity: number;
    currentStockQuantity: number;
    updateQuantity: number;
  }
   interface InventoryPurchaseOrderItem {
    _id: string;
    companyName: string;
    flavourOrFeature: string;
    itemBarcode: string;
    itemBrandName: string;
    itemCategory: string;
    itemMRPperUnit: number;
    itemName: string;
    itemPerUnitQuantity: number;
    itemShelfDates: InventoryPurchaseOrderItemShelfDate[];
    purchaseData: InventoryPurchaseOrderEntry[];  
    quantityUnitName: string;
    saleTime: string;
    sku: string;
    subCategory: string;
  }
  interface InventoryPurchaseOrderState {
    items: InventoryPurchaseOrderItem[];
    page: number;
    rowsPerPage: number;
    rowCount: number;
    isLoading: boolean;
    cache: Record<string, InventoryTableRow[]>;
    selectedItem: InventoryPurchaseOrderItem | null
  }

  interface PaginationStrategy {
    limitParamName: string;
    offsetParamName: string;
    offsetType: 'page' | 'skip';
    startOffsetValue: number; // e.g., page 2 if first page was 1, or skip 100 if first 100 items fetched
  }
  
  interface ExecutePaginatedAPICallsParams<T> {
    apiFnToGetData: (params: Record<string, any>) => Promise<T[]>; // Takes dynamic params, returns data array
    totalObjectsCount: number;
    itemsPerCall: number;
    paginationStrategy: PaginationStrategy;
    parallelCalls?: number;
    maxRetriesPerCall?: number;
  }
  interface CatalogCardProps {
    title: string;
    subtitle?: string;
    brands?: Array<{ _id: string; brandName: string }>;
    companies?: Array<{ _id: string; companyName: string }>;
    dealers?: Array<{ _id: string; dealerName: string; dealerNumber: number }>;
  }

  interface dealerCatalogCounts {
    dealers: number;
    companies: number;
    brands: number;
  }
  
  interface dealerCatalogDealer {
    _id: string;
    dealerName: string;
    dealerNumber: number;
    brands: Array<{ _id: string; brandName: string }>;
    companies: Array<{ _id: string; companyName: string }>;
  }
  
  interface dealerCatalogCompany {
    _id: string;
    companyName: string;
    dealers: Array<{ _id: string; dealerName: string; dealerNumber: number }>;
    brands: Array<{ _id: string; brandName: string }>;
  }
  
  interface dealerCatalogBrand {
    _id: string;
    brandName: string;
    companies: Array<{ _id: string; companyName: string }>;
    dealers: Array<{ _id: string; dealerName: string; dealerNumber: number }>;
  }
  
  type dealerCatalogItem = dealerCatalogDealer | dealerCatalogCompany | dealerCatalogBrand;
  
  interface dealerCatalogTabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

}
declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.sass' {
  const content: { [className: string]: string };
  export default content;
}

export interface StaticItemData {
  _id: string;                          // MongoDB ObjectId as string
  itemBarcode: string;                  // EAN / UPC
  itemName: string;
  itemPerUnitQuantity: number;          // e.g. 35
  quantityUnitName: string;             // "g", "ml", "pcs"…
  itemMRPperUnit: number;               // Maximum retail price
  itemBrandName: string;                // "CADBURY"
  itemCategory: string;                 // "Packaged Food"
  subCategory: string;                  // "Chocolates & Candies"
  companyName: string;                  // Manufacturer / brand owner
  flavourOrFeature: string;             // empty string allowed
  sku: string;                          // human-readable composite key
  saleTime: 'daily' | 'weekly' | 'monthly' | 'yearly' | string;
  images: string[];                     // array of image URLs or keys
}

type ExpiryDetail = {
  date: Date;
  value: number;
  mfgDate: Date;
  isShelfExpired: boolean;
  totalShelfLife: string;
  leftShelfLife: string;
  initialItemQuantity: number;
};
export interface PurchaseEntry {
  cp: number;
  sp: number;
  manufacturing: string;
  expiry: string;
  qty: number;
  totalStockQty: number | null;
  purchaseDate: string;
  totalShelfLife: string;
  leftShelfLife: string;
  purchaseOrderId: string;
  poApproveTime: string;
  expiryDetails: ExpiryDetail[];
  initialItemQuantity: number;
  dealerName: string;
}

export interface InventoryRow {
  staticData: StaticItemData;
  purchases: PurchaseEntry[];
  _id: string;
}

export type InventoryTableRow = Omit<StaticItemData, '_id'> & {
  _id: string;                
  purchases: PurchaseEntry[]; 
};


interface Shelf {
  _id: string;
  purchaseOrderId?: string;
  entryDate: string;
  manufacturingDate: string;
  expiryDate: string;
  initialStockQuantity: number;
  currentStockQuantity: number;
  costPrice?: number;
}

export interface Purchase {
  _id?: string;
  purchaseOrderId?: string;
  dealerId?: { _id: string; dealerName: string };
  items: PurchaseItem[];
  draftTime?: string;
  approveTime?: string;
  costPrice?: number;
}

export interface PurchaseItem {
  _id?: string;
  purchaseOrderId?: string;
  dealerId?: { _id: string; dealerName: string };
  items: PurchaseItem[];
  draftTime?: string;
  approveTime?: string;
  costPrice?: number;
}

export interface ItemData {
  _id: string;
  sku: string;
  itemBrandName: string;
  companyName: string;
  itemShelfDates: Shelf[];
  purchaseData: Purchase[];
}

export interface ExpiredItemTableProps {
  items?: ItemData[];
  expiryBatchData?: {
    _id: string;
    manufacturingDate: string;
    itemId: {
      _id: string
    };
    expiryDate: string;
    quantity: number;
    purchaseOrderId: {
      _id: string
    };
    costPricePerUnit: number;
    totalCostPrice: number;
  }[];
  setItemsData: (items: any) => void;
  id?: string;
  isLoading?: boolean;
}

export interface ImageComponentProps {
  src: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
  radius?: MantineNumberSize;
  fit?: 'contain' | 'cover' | 'fill';
  className?: string;
  style?: React.CSSProperties;
  fallbackSrc?: string;
  withModal?: boolean;
  modalSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  onClick?: () => void;
}

export interface CloudImage {
  public_id: string;
  secure_url: string;
}

export interface ImagePreviewProps {
  images: CloudImage[];
  title: string;
}

export interface ImageUploadComponentProps {
  onImagesChange?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; 
  acceptedFileTypes?: string[];
  initialImages?: any[];
  disabled?: boolean;
  className?: string;
  size?: number;
  previewSize?: number; 
}

export interface PurchasedItemDetailFormProps {
  onSubmit: (data: PurchasedItemDetailFormType) => void;
  loading?: boolean;
  isApprovedPO?: boolean;
  onItemSelect?: (item: any) => void;
  purchaseOrderId: string;
}

export {};


