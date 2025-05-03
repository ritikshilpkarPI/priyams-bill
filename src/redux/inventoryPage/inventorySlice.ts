import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryRow, InventoryTableRow } from 'src/types';

interface InventoryState {
  items: InventoryTableRow[];
  page: number;
  rowsPerPage: number;
  rowCount: number;
  isLoading: boolean;
  cache: Record<string, InventoryTableRow[]>;
}

const initialState: InventoryState = {
  cache: {},
  items: [],
  page: 0,
  rowsPerPage: 10,
  rowCount: 0,
  isLoading: false,
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
    putPageInCache(state, action: PayloadAction<{ key: string; rows: InventoryTableRow[] }>) {
      const { key, rows } = action.payload;
      state.cache[key] = rows;
    },
    showRows(state, action: PayloadAction<InventoryTableRow[]>) {
      state.items = action.payload;
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
} = inventorySlice.actions;

export default inventorySlice.reducer;
