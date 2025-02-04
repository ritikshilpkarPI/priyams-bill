import mongoose, { ObjectId } from "mongoose";
import { store } from "./redux/store";

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
    lastMonthSold?: number;
    lastThreeMonthSold?: soldItemsByDateInterface[];
    lastYearSold?: soldItemsByDateInterface[];
  }

  interface SellDetailsTableProps {
    tableData: ItemSoldInterface[];
    threeMonthDates?: { currentDate: string, previousDate:string}
    oneYearDates?: { currentDate: string, previousDate:string}
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


