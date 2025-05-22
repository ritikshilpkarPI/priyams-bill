import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ExpiredItemsState = {
  items: [],
  isLoading: false,
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  order: 'desc',
  orderBy: 'expiryDate',
  page: 1,
  rowsPerPage: 10,
};

const expiredItemsSlice = createSlice({
  name: 'expiredItems',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setExpiredItems(state, action: PayloadAction<ExpiredItem[]>) {
      state.items = action.payload;
    },
    resetExpiredItems(state) {
      state.items = [];
      state.isLoading = false;
    },
    setStartDate(state, action: PayloadAction<Date>) {
      state.startDate = action.payload;
    },
    setEndDate(state, action: PayloadAction<Date>) {
      state.endDate = action.payload;
    },
    setOrder(state, action: PayloadAction<'asc' | 'desc'>) {
      state.order = action.payload;
    },
    setOrderBy(state, action: PayloadAction<string>) {
      state.orderBy = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setRowsPerPage(state, action: PayloadAction<number>) {
      state.rowsPerPage = action.payload;
    },
  },
});

export const {
  setLoading,
  setExpiredItems,
  resetExpiredItems,
  setStartDate,
  setEndDate,
  setOrder,
  setOrderBy,
  setPage,
  setRowsPerPage,
} = expiredItemsSlice.actions;
export default expiredItemsSlice.reducer;
