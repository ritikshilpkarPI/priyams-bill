import mongoose, { ObjectId } from "mongoose";
import { store } from "./redux/store";
import { RefObject } from "react";
import { NumberValue } from "d3";

declare global {
  export interface UserStateType {
  }

  export type RootState = ReturnType<typeof store.getState>;

  export interface EnvironmentInterface {
    REACT_APP_API_BASE_URL: string;
  }

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

  export interface CreateRzpQRAPIDataType {
    amountInRs: number;
    id: string;
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
  }

  interface CategorySchemaType {
    name: string;
  }

  interface SubCategorySchemaType {
    name: string;
    categoryId: ObjectId;
  }

  interface BrandSchemaType {
    name: string;
    companyId: ObjectId;
  }

  interface CompanySchemaType {
    name: string;
  }
  interface SalesmanSchemaInterface {
    salesmanName?: string;
    salesmanContactNumber?: { contactNumber: string; updatedAt: Date }[];
    dealerId?: mongoose.Types.ObjectId; 
  }
  interface SalesmanModelInterface extends Document, SalesmanSchemaInterface {}
  interface DealerSchemaInterface {
    dealerName?: string; 
    dealerAddress?: { address: string; updatedAt: Date }[];
    dealerContactNumber?: { contactNumber: string; updatedAt: Date }[]; 
    dealerVisitingCard?: {  publicId: String , secureUrltype: String }; 
  }
  interface DealerModelInterface extends Document, DealerSchemaInterface {}
  interface PaymentDetailsSchemaInterface {
    paymentType?: 'Cash' | 'Cheque' | 'UPI' | 'NEFT'; 
    paymentAmount?: number; 
    purchaseOrderReference?: mongoose.Types.ObjectId; 
    dealerReference?: mongoose.Types.ObjectId; 
    paymentRemarks?: string; 
    paymentProofImage?: {  publicId: String , secureUrltype: String }; 
  }
  interface PaymentDetailsModelInterface extends Document, PaymentDetailsSchemaInterface {}
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

  type itemsByBarcode = string[] | any
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

  export interface ItemNameSKUProps {
    itemName: string;
    barcode: string;
    mrp: number;
    packetQty: number;
    packetUnit: string;
  }

  interface DealerDetailFormType {
    paymentType: 'fully-paid' | 'partially-paid' | 'credit';
    billAmount: number;
    procurementSource: 'Walmart' | 'D Mart' | 'City' | 'Distributor';
    dealerName: string;
    mobileNumber: string;
    remarks: string;
  };

  interface DealerDetailsFormProps {
    onSubmit: (dealerFormData: DealerDetailFormType) => void;
  }

  interface PurchasedItemDetailFormType {
    barcode: string;
    itemName: string;
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
  }

  interface PurchasedItemDetailFormProps {
    onSubmit: (purchasedItemFormData: PurchasedItemDetailFormType) => void;
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

  interface PurchaseOrderDataType {
    isApproved?: boolean;
    isRejected?: boolean;
    isDraft?: boolean;
    isPaid?: boolean;
    totalPaidAmount?: number;
    createdAt?: string;
    _id?: string;
    purchasedItems?: Array<PurchasedItemDetailFormType>;
  }

  interface PurchasedItemTableProps {
    onRemove: (purchasedItem: PurchasedItemDetailFormType, idx: number) => void;
    onEdit: (purchasedItem: PurchasedItemDetailFormType, idx: number) => void; 
  }

  interface QuestionModalProps {
    opened: boolean;
    onClose: () => void;
    question: string;
    onAgree: () => void;
    onDisagree: () => void;
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

export {};


