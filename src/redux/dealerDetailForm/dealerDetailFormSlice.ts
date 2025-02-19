import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: DealerDetailFormType = {
  paymentType: 'fully-paid',
  billAmount: 0,
  procurementSource: 'Walmart',
  dealerName: '',
  mobileNumber: '',
  remarks: '',
};

const dealerDetailFormSlice = createSlice({
  name: 'dealerDetailForm',
  initialState,
  reducers: {
    setDealerFormData: (state, action: PayloadAction<Partial<DealerDetailFormType>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  setDealerFormData,
} = dealerDetailFormSlice.actions;

export default dealerDetailFormSlice.reducer;
