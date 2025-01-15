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
