import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';


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
    setBill: (state, action: PayloadAction<BillState>) => {

      return action.payload;
    },
    resetBillState: (state) => {
      Object.assign(state, initialState, { billId: `${uuidv4()}-${Date.now()}` });
    },
   
  },
});

export const { updateBillItems, updateCustomerInfo, updatePayment, resetBillState,   setBill,
} = billSlice.actions;
export default billSlice.reducer;