import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: ExpiredItemsState = {
  items: [],
  isLoading: false,
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
  },
});

export const { setLoading, setExpiredItems, resetExpiredItems } = expiredItemsSlice.actions;
export default expiredItemsSlice.reducer;
