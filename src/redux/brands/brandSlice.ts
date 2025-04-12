import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: BrandState = {
  brands: [],
  loading: false,
  error: null,
};

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    setBrands: (state, action: PayloadAction<Brand[]>) => {
      state.brands = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setBrands, setLoading, setError } = brandSlice.actions;
export default brandSlice.reducer;
