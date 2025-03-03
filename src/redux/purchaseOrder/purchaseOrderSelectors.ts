export const selectPurchaseOrder = (state: RootState) => state.purchaseOrder;
export const selectPurchasedItems = (state: RootState) =>
  state.purchaseOrder.purchasedItems;
export const selectPaymentDetails = (state: RootState) =>
  state.purchaseOrder.purchaseDetails;
