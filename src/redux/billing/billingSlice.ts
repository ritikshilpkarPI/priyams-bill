import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getBillingLeanItemsAPI } from 'src/utils/apiUtils';
import { AppDispatch } from '../store';

interface Item {
  itemBarCodesList: number[];
  itemNamesList: string[];
  itemsBarCodeMap: Record<string, number[]>;
  itemsNameMap: Record<string, object>;
  totalItemsCount: number;
}
interface BillingState {
  items: Item | null;
  loading: boolean;
  error: string | null;
}

const initialState: BillingState = {
  items: null,
  loading: false,
  error: null,
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    setBillingItems: (state, action: PayloadAction<Item>) => {
      state.items = action.payload;
      state.loading = false;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setLoading, setBillingItems, setError } = billingSlice.actions;

export default billingSlice.reducer;

export const fetchBillingItems = () => async (dispatch: AppDispatch) => {
  try {
    const response = await getBillingLeanItemsAPI();
    if (response && !response.isError) {
      dispatch(setBillingItems(response));
    } else {
      throw new Error(response.err || 'Something went wrong');
    }
  } catch (error: any) {
    throw new Error(error);
  }
};
