import { createSlice } from '@reduxjs/toolkit';

const initialState: PurchaseOrderDataType = {};

const purchaseOrderSlice = createSlice({
  name: 'purchaseOrder',
  initialState,
  reducers: {
    setPurchaseOrder: (state, action) => {
      Object.assign(state, action.payload);
    },
    addPurchasedItem: (state, action) => {
      if(state?.purchasedItems) state.purchasedItems.push(action.payload);
      else state.purchasedItems = [action.payload];
    }
  },
});

export const {
  setPurchaseOrder,
  addPurchasedItem
} = purchaseOrderSlice.actions;

export default purchaseOrderSlice.reducer;
