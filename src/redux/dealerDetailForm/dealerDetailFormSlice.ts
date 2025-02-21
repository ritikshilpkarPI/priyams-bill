import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: DealerDetailFormType = {
  payment: 'Fully Paid',
  billAmount: 0,
  procurementSource: 'Walmart',
  dealerName: '',
  phoneNumber: '',
  remark: '',
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
