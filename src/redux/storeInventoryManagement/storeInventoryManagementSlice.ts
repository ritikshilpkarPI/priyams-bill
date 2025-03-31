import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StoreInventoryState {
  selectedStoreId: string;
  inventoryItems: any[];
  stores: string[];
}

const initialState: StoreInventoryState = {
  selectedStoreId: '',
  inventoryItems: [],
  stores: [],
};

const storeInventorySlice = createSlice({
  name: 'storeInventory',
  initialState,
  reducers: {
    setStores: (state, action: PayloadAction<string[]>) => {
      state.stores = action.payload;
    },
    setSelectedStore: (state, action: PayloadAction<string>) => {
      state.selectedStoreId = action.payload;
    },
    addInventoryItem: (state, action: PayloadAction<StoreInventoryItem>) => {
      state.inventoryItems.push(action.payload);
    },
    updateInventoryItemQuantity: (
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>
    ) => {
      const { itemId, quantity } = action.payload;
      const item = state.inventoryItems.find(
        (invItem) => invItem.itemDetail._id === itemId
      );
      if (item) {
        item.quantityToAdd = quantity;
      }
    },
    removeInventoryItem: (state, action: PayloadAction<string>) => {
      state.inventoryItems = state.inventoryItems.filter(
        (invItem) => invItem.itemDetail._id !== action.payload
      );
    },
    resetStoreInventory: (state) => {
      state.selectedStoreId = '';
      state.inventoryItems = [];
    },
  },
});

export const {
  setStores,
  setSelectedStore,
  addInventoryItem,
  updateInventoryItemQuantity,
  removeInventoryItem,
  resetStoreInventory,
} = storeInventorySlice.actions;

export default storeInventorySlice.reducer;
