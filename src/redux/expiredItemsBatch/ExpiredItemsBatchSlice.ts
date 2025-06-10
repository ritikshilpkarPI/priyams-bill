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
}

const expiredItemsBatchSlice = createSlice({
  name: 'expiredItemsBatch',
  initialState,
  reducers: {
    setExpiredItemsBatch: (state, action: PayloadAction<SetExpiredItemsPayload>) => {
      state.data = action.payload.data;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.pagination.total = action.payload;
    },
  },
});

export const { setExpiredItemsBatch,setPage , setLimit, setLoading, setTotal } = expiredItemsBatchSlice.actions;

export default expiredItemsBatchSlice.reducer;
