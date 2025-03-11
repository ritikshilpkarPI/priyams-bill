import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: PaymentDetailType = {
    totalBillAmount: 0,
    totalPayableAmount: 0,
    paymentType: 'fully paid',
    addCreditDetail: {
        creditAmount: 0,
        payDate: new Date().toLocaleDateString(),
    },
    addPaymentDetail: {
        paymentDate: new Date().toLocaleDateString(),
        paidBy: 'UPI',
        paidAmount: 0,
        paymentImages: [],
        idx: 0
    },
    credits: [],
    payments: [],
    paymentFormState: {
        addCredit: false,
        makePayment: false,
    },
};

const paymentDetailFormSlice = createSlice({
  name: 'paymentDetailForm',
  initialState,
  reducers: {
    setPaymentDetailForm: (state, action) => {
      Object.assign(state, action.payload);
    },
    resetPaymentDetailForm: (state) => {
      Object.assign(state, initialState);
    },
    setAddCreditForm: (state, action) => {
        if(state?.addCreditDetail)
      Object.assign(state.addCreditDetail, action.payload);
    },
    resetAddCreditForm: (state) => {
        if(state?.addCreditDetail)
        state.addCreditDetail = initialState.addCreditDetail;
    },
    setAddCredit:(state, action)=>{
      state.credits?.push(action.payload)
    },
    removeCreditRecord : (state, action: PayloadAction<number>) => {
      if(state.credits) state.credits = state.credits.filter((_, index) => index !== action.payload);
  },
    setMakePaymentForm: (state, action) => {
      if(state?.addPaymentDetail)
      Object.assign(state.addPaymentDetail, action.payload);
    },
    resetMakePaymentForm: (state) => {
      state.addPaymentDetail = initialState.addPaymentDetail;
    },
    setAddPayment:(state, action)=>{
      state.payments?.push(action.payload)
    },
    removePaymentRecord : (state, action: PayloadAction<number>) => {
        if(state.payments) state.payments = state.payments.filter((_, index) => index !== action.payload);
    },
    setPaymentFormState: (state, action) => {        
        Object.assign(state.paymentFormState = action.payload);
    }
  },
});

export const { 
    setPaymentDetailForm, resetPaymentDetailForm,
    setAddCreditForm, resetAddCreditForm, setAddCredit, removeCreditRecord,
    setMakePaymentForm, resetMakePaymentForm, setAddPayment, removePaymentRecord,
    setPaymentFormState,
} = paymentDetailFormSlice.actions;

export default paymentDetailFormSlice.reducer;