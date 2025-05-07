import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryRow, InventoryTableRow } from 'src/types';


const initialState: InventoryPurchaseOrderState = {
  cache: {},
  items: [],
  page: 0,
  rowsPerPage: 10,
  rowCount: 0,
  isLoading: false,
  selectedItem: null
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setRowsPerPage(state, action: PayloadAction<number>) {
      state.rowsPerPage = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setRowCount(state, action: PayloadAction<number>) {
      state.rowCount = action.payload;
    },
    /* ---------- cache & view helpers ---------- */
    putPageInCache(state, action ) {
      const { key, rows } = action.payload;
      state.cache[key] = rows;
    },
    showRows(state, action: PayloadAction<InventoryPurchaseOrderItem[]>) {
      state.items = action.payload;
    },
    setSelectedItem(state, action: PayloadAction<InventoryPurchaseOrderItem>) {
      state.selectedItem = action.payload;
    },
    setshelfCount(state, action: { payload: {
      _id: string; 
      updateQuantity: number;
    }; }){
      const { _id, updateQuantity } = action.payload;
      if (state.selectedItem) {
        state.selectedItem.itemShelfDates = state.selectedItem.itemShelfDates.map((shelfDate) =>
          shelfDate._id === _id
            ? { ...shelfDate, updateQuantity }
            : shelfDate
        );
      }
    },
    resetInventory: () => initialState,
  },
});

export const {
  setPage,
  setRowsPerPage,
  setIsLoading,
  setRowCount,
  resetInventory,
  putPageInCache,
  showRows,
  setSelectedItem,
  setshelfCount,
} = inventorySlice.actions;

export default inventorySlice.reducer;
