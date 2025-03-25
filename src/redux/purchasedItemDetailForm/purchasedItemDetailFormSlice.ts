import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PurchasedItemDetailFormType = {
  barcode: '',
  inputName: '',
  mrp: 0,
  itemQuantity: 0,
  unit: 'grams',
  itemRemark: '',
  sellingPrice: 0,
  costPrice: 0,
  validate: false,
  item_id: '',
  brand: '',
  category: '',
  subCategory: '',
  flavourOrFeature: '',
  companyName: '',
  saleTime: '',
  expiryDates: [],
  slabPrice: [],
  stockQuantity: 0,
  returnPolicyAvailable: false,
  freeItemsAvailable: false,
  freeItemsRemarks: '',
  returnPolicyRemarks: '',
  itemHasExpiry: null as boolean | null,
};

const purchasedItemDetailFormSlice = createSlice({
  name: 'purchasedItemDetailForm',
  initialState,
  reducers: {
    setPurchasedItemDetailForm: (
      state,
      action: PayloadAction<Partial<PurchasedItemDetailFormType>>
    ) => {
      Object.assign(state, action.payload);
    },
    addItemExpiryDateData: (state, action) => {
      state.expiryDates.push(action.payload);
    },
    removeItemExpiryDateByIdx: (state, action) => {
      state.expiryDates = state.expiryDates.filter(
        (_, idx) => action.payload !== idx
      );
    },
    resetPurchasedItemForm: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setPurchasedItemDetailForm,
  addItemExpiryDateData,
  removeItemExpiryDateByIdx,
  resetPurchasedItemForm,
} = purchasedItemDetailFormSlice.actions;

export default purchasedItemDetailFormSlice.reducer;
