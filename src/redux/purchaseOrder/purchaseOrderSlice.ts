import { createSlice } from '@reduxjs/toolkit';

const initialState: PurchaseOrderDataType = {
  _id: '',
  dealerName: '',
  phoneNumber: '',
  billAmount: 0,
  payment: 'Fully Paid',
  procurementSource: 'Walmart',
  remark: '',
  purchasedItems: [],
  purchaseDetails: {},
  billPhotos: [],
  totalPaidAmount: 0,
  isApproved: undefined,
  isDraft: undefined,
  isRejected: undefined,
  statusHistory:[],
  dealerId: '',
};

const purchaseOrderSlice = createSlice({
  name: 'purchaseOrder',
  initialState,
  reducers: {
    setPurchaseOrder: (state, action) => {
      Object.assign(state, action.payload);
    },
    addPurchasedItem: (state, action) => {
      if (state?.purchasedItems) state.purchasedItems.push(action.payload);
      else state.purchasedItems = [action.payload];
    },
    resetPurchaseOrder: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setPurchaseOrder, addPurchasedItem, resetPurchaseOrder } =
  purchaseOrderSlice.actions;

export default purchaseOrderSlice.reducer;
