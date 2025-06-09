export const REPORT_TYPES = {
  TOTAL_SALES: 'totalAmount',
  TOTAL_PROFIT: 'totalProfit',
  TOTAL_DISCOUNT: 'totalDiscount',
  TOTAL_MRP: 'totalMRP',
  TOP_ITEMS_BY_QTY: 'highestSellingByQuantity',
  TOP_ITEMS_BY_AMOUNT: 'highestSellingByAmount',
  CATEGORY_WISE: 'categoryWiseTopProducts',
  BRAND_WISE: 'brandWiseTopProducts',
  TOP_DEALERS_QTY: 'topDealersByQuantity',
  TOP_DEALERS_AMOUNT: 'topDealersByAmount',
  PURCHASED_ITEMS: 'purchasedItems',
  ITEM_BILLING_TREND: 'itemBillingTrend',
  OVERALL_ITEM_BILLING: 'allItemsBillingTrend',
} as const;

export const ITEMS_PER_PAGE = 10; 