import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Dealer {
  _id?: string;
  dealerName: string;
  dealerBrands: string[];
  dealerCompanies: string[];
  dealerNumber: number;
}

interface DealerState {
  dealers: Dealer[];
  loading: boolean;
  error: string | null;
  selectedDealerId?: string;
}

const initialState: DealerState = {
  dealers: [],
  loading: false,
  error: null,
  selectedDealerId : "",
};

const dealerSlice = createSlice({
  name: "dealers",
  initialState,
  reducers: {
    setDealers: (state, action: PayloadAction<Dealer[]>) => {
      state.dealers = action.payload;
    },
    setDealersLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setDealerId: (state, action: PayloadAction<string>) => {
      state.selectedDealerId = action.payload;
    },
  },
});

export const { setDealers, setDealersLoading, setError, setDealerId } = dealerSlice.actions;
export default dealerSlice.reducer;
