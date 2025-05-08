import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: StoreInventoryStateType = {
  items: [],
  itemCount: 0,
  selectedStoreId: '',
  stores: [],
  selecteditem: null,
};

const storeInventorySlice = createSlice({
  name: 'storeInventory',
  initialState,
  reducers: {
    setStores: (state, action: PayloadAction<any[]>) => {
      state.stores = action.payload;
    },
    setSelectedStore: (state, action: PayloadAction<string>) => {
      state.selectedStoreId = action.payload;
    },
    setItems: (state, action: PayloadAction<StoreInventoryItemType[]>) => {
      state.items = action.payload;
    },
    setItemCount: (state, action: PayloadAction<number>) => {
      state.itemCount = action.payload;
    },
    updateItem: (
      state,
      action: PayloadAction<{
        itemsId: string;
        shelfDateId: string;
        value: number;
      }>
    ) => {
      const item = state.items.find(
        (item) => item._id === action.payload.itemsId
      );
      if (item) {
        const shelfDate = item.itemShelfDates.find(
          (shelf) => shelf._id === action.payload.shelfDateId
        );
        if (shelfDate) {
          shelfDate.updateQuantity = action.payload.value;
        }
      }
    },
    setSelectedItem: (state, action: PayloadAction<StoreInventoryItemType | null>) => {
      state.selecteditem = action.payload;
    },

    clearItems: (state) => {
      state.items = [];
    },
  },
});

export const {
  setStores,
  setSelectedStore,
  setItems,
  setItemCount,
  updateItem,
  setSelectedItem,
  clearItems,
} = storeInventorySlice.actions;

export default storeInventorySlice.reducer;
