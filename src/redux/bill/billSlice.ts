import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface BillItem {
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

export interface BillState {
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

const initialState: BillState = {
  billItems: [],
  customerName: '',
  customerPhone: '',
  billMRPTotal: 0,
  billAmountTotal: 0,
  billDiscountTotal: 0,
  totalNumberOfItems: 0,
  totalNumberOfUniqueItems: 0,
  totalBillProfit: 0,
  cashPay: 0,
  upiPay: 0,
  amountReturn: 0,
  billId: `${uuidv4()}-${Date.now()}`,
};

const billSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    updateBillItems: (state, action: PayloadAction<BillItem[]>) => {
      state.billItems = action.payload;
    },
    updateCustomerInfo: (state, action: PayloadAction<{ field: string; value: string }>) => {
      (state as any)[action.payload.field] = action.payload.value;
    },
    updatePayment: (state, action: PayloadAction<{ type: 'cashPay' | 'upiPay'; amount: number }>) => {
      state[action.payload.type] = action.payload.amount;
    },
    resetBillState: (state) => {
      Object.assign(state, initialState, { billId: `${uuidv4()}-${Date.now()}` });
    },
   
  },
});

export const { updateBillItems, updateCustomerInfo, updatePayment, resetBillState } = billSlice.actions;
export default billSlice.reducer;