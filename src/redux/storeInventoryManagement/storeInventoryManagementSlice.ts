import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StoreInventoryState {
  selectedStoreId: string;
  inventoryItems: any[];
  stores: Store[];
  sourceStaff: any[],
  destinationStaff: any[],
}

const initialState: StoreInventoryState = {
  selectedStoreId: '',
  inventoryItems: [],
  stores: [],
  sourceStaff: [],
  destinationStaff: [],
};

const storeInventorySlice = createSlice({
  name: 'storeInventory',
  initialState,
  reducers: {
    setStores: (state, action: PayloadAction<Store[]>) => {
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
      action: PayloadAction<{ itemId: string; quantity: number; shelfId?: string }>
    ) => {
      const { itemId, quantity, shelfId } = action.payload;
    
      let item = state.inventoryItems.find(
        (invItem) => invItem.itemDetail._id === itemId
      );
    
      if (!item) return;
    
      if (shelfId) {
        const batch = item.itemDetail.itemShelfDates?.find(
          (batch: any) => batch._id === shelfId
        );
        if (batch) {
          batch.quantityToAdd = quantity;
          item = {
            ...item,
              itemShelfDates: item.itemDetail.itemShelfDates?.map((batch: any) =>
                batch._id === shelfId ? { ...batch, quantity: quantity ?? 0 } : batch
              ),
          }
        }
      } else {
        item.quantityToAdd = quantity;
      }
      state.inventoryItems = state.inventoryItems.map((invItem) =>
        invItem.itemDetail._id === itemId ? item : invItem
      );
    },
    removeInventoryItem: (state, action: PayloadAction<string>) => {
      state.inventoryItems = state.inventoryItems.filter(
        (invItem) => invItem.itemDetail._id !== action.payload
      );
    },
    resetStoreStockInventory: (state) => {
      state.selectedStoreId = '';
      state.inventoryItems = [];
      state.stores = [];
      state.sourceStaff = [];
      state.destinationStaff = [];

    
    },
    setSourceStaff: (state, action) => {
      state.sourceStaff = action.payload;
    },
    setDestinationStaff: (state, action) => {
      state.destinationStaff = action.payload;
    },
  },
});

export const {
  setStores,
  setSelectedStore,
  addInventoryItem,
  updateInventoryItemQuantity,
  removeInventoryItem,
  resetStoreStockInventory,
  setSourceStaff,
  setDestinationStaff,
} = storeInventorySlice.actions;

export default storeInventorySlice.reducer;
