import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PurchasedItemDetailFormType = {
    barcode: '',
    itemName: '',
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
    returnPolicyRemarks: '',
};

const purchasedItemDetailFormSlice = createSlice({
  name: 'purchasedItemDetailForm',
  initialState,
  reducers: {
    setPurchasedItemDetailForm: (state, action: PayloadAction<Partial<PurchasedItemDetailFormType>>) => {
      Object.assign(state, action.payload);
    },
    addItemExpiryDateData: (state, action) => {
      state.expiryDates.push(action.payload);
    },
    removeItemExpiryDateByIdx: (state, action) => {
      state.expiryDates = state.expiryDates.filter((_, idx) => action.payload !== idx);
    }
  },
});

export const {
  setPurchasedItemDetailForm,
  addItemExpiryDateData,
  removeItemExpiryDateByIdx
} = purchasedItemDetailFormSlice.actions;

export default purchasedItemDetailFormSlice.reducer;
