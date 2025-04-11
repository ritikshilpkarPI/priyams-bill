import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: companyState = {
  companys: [],
  loading: false,
  error: null,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setCompanies: (state, action: PayloadAction<company[]>) => {
      state.companys = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setCompanies, setLoading, setError } = companySlice.actions;
export default companySlice.reducer;
