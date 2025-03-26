export const selectPurchaseOrder = (state: RootState) => state.purchaseOrder;
export const selectPurchasedItems = (state: RootState) =>
  state.purchaseOrder.purchasedItems;
export const selectPaymentDetails = (state: RootState) =>
  state.purchaseOrder.purchaseDetails;
export const selectPurchaseOrderStatusInfo = (state: RootState) => ({
  isDraft: state.purchaseOrder.isDraft,
  isApproved: state.purchaseOrder.isApproved,
  isRejected: state.purchaseOrder.isRejected,
});
