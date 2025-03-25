export const selectPaymentDetailForm = (state: RootState) =>
    state.paymentDetailForm;
  export const selectPaymentFormState = (state: RootState) =>
    state.paymentDetailForm.paymentFormState;
  export const selectAddCreditFormState = (state: RootState) =>
    state.paymentDetailForm.addCreditDetail;
  export const selectMakePaymentFormState = (state: RootState) =>
    state.paymentDetailForm.addPaymentDetail;
  export const selectPaymentsState = (state: RootState) =>
    state.paymentDetailForm.payments;
  export const selectCreditsState = (state: RootState) =>
    state.paymentDetailForm.credits;