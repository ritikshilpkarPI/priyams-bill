import { ObjectId } from "mongoose";
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

  interface SampleData {
    date: string;
    value: number;
  }
  
  interface LineGraphProps {
    data: SampleData[];
    width: number;
    height: number;
  }

  interface ItemSoldPurchaseOrder {
    orderSequence:string
    approvalDate: string;
    amount: number;
    costPrice: number
  }

  interface ItemSoldInterface {
    itemName: string;
    itemPrise: number;
    soldAfterApproval: number;
    soldInLastMonth: number;
    soldInLastThreeMonths: { date: string; value: number }[];
    soldInLastYear: { date: string; value: number }[];
    lastThreePurchaseOrder : ItemSoldPurchaseOrder[];
  }

  interface SellDetailsTableProps {
    tableData: ItemSoldInterface[];
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
