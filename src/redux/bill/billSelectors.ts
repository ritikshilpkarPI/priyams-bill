import { RootState } from '../store';

export const selectBill = (state: RootState) => state.bill;
export const selectBillingItems = (state: RootState) => state.bill.items;