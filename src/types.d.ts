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
  }

  interface StoreInventoryItem extends WarehouseItem {
    quantityToAdd: number;
  }

  interface Store {
    _id: string;
    name: string;
    code: string;
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
    cellClassName?: string;
  }
  
  interface DataTableProps {
    columns: Column[];
    data: any[];
    isLoading: boolean;
    order: 'asc' | 'desc';
    orderBy: string;
    onSort: (columnKey: string) => void;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    rowCount: number;
    paginationMode?: 'client' | 'server'; 
    onRowClick?: GridEventListener<'rowClick'>;
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
  }
  
  interface InventoryItem {
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
    items: InventoryItem[];
    onQuantityChange: (
      itemId: string,
      quantity: number,
      shelfId?: string 
    ) => void;
    onRemoveItem: (itemId: string) => void;
  }
  interface ShelfLifeInfoProps {
    expiryDate: {
      mfgDate: string | Date;
      date: string | Date;
    };

  }
  interface Shelf {
    _id: string;
    expiryDate: string;
    manufacturingDate: string;
    quantity: number;
    quantityToAdd?: number;
  }
  
  interface ShelfTableProps {
    shelfList: Shelf[];
    itemId: string;
    handleQuantityChange: (
      itemId: string,
      shelfQuantity: number,
      newQuantity: number,
      shelfId: string
    ) => void;
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
}
declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.sass' {
  const content: { [className: string]: string };
  export default content;
}

export {};


