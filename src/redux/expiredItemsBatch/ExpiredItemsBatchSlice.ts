import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ExpiredItemsStateType = {
  data: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 0,
    total: 0,
  },
};

interface SetExpiredItemsPayload {
  data: ExpiredItem[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
  };
}

const expiredItemsBatchSlice = createSlice({
  name: 'expiredItemsBatch',
  initialState,
  reducers: {
    setExpiredItemsBatch: (state, action: PayloadAction<SetExpiredItemsPayload>) => {
      state.data = action.payload.data;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setExpiredItemsBatch } = expiredItemsBatchSlice.actions;

export default expiredItemsBatchSlice.reducer;
