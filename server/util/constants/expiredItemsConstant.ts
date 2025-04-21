export const expiredStatus = Object.freeze({
  SAVED: 'SAVED',
  DRAFTED: 'DRAFTED',
  APPROVED: 'APPROVED',
  CLEARED: 'CLEARED',
});

export const clearanceReason = Object.freeze({
  REVERTED_TO_DEALER: 'REVERTED_TO_DEALER',
  CLEARED_BY_PURCHASE_ORDER: 'CLEARED_BY_PURCHASE_ORDER',
  SOLD_ON_OFFER: 'SOLD_ON_OFFER',
  DISPOSED: 'DISPOSED',
});
