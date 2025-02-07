import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getBillingLeanItemsAPI } from 'src/utils/apiUtils';
import { v4 as uuidv4 } from 'uuid';
import { AppDispatch } from '../store';

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
interface Item {
  itemBarCodesList: number[];
  itemNamesList: string[];
  itemsBarCodeMap: Record<string, number[]>;
  itemsNameMap: Record<string, object>;
  totalItemsCount: number;
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
  items: Item | null
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
  items: null,
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
    setBillingItems: (state, action: PayloadAction<Item>) => {
      state.items = action.payload;
    },
  },
});

export const { updateBillItems, updateCustomerInfo, updatePayment, resetBillState,setBillingItems } = billSlice.actions;
export default billSlice.reducer;
export const fetchBillingItems = () => async (dispatch: AppDispatch) => {
    try {
      const response = await getBillingLeanItemsAPI();
      if (response && !response.isError) {
        dispatch(setBillingItems(response));
      } else {
        throw new Error(response.err || 'Something went wrong');
      }
    } catch (error: any) {
      throw new Error(error);
    }
  };
