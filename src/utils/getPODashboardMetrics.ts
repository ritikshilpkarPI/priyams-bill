import { isShelfExpired } from "./isShelfExpired";

export const getPODashboardMetrics = (items: PurchasedItemDetailFormType[]) => {
  let totalBillAmount = 0;
  let totalProfitMargin = 0;
  let uniqueItemsCount = 0;
  let existingItemsCount = 0;
  let newItemsCount = 0;
  let itemsWithManuAndExpiry = 0;
  let itemsWithShortExpiry = 0;

  items?.forEach((item) => {
    const itemOrderQuantity = item.stockQuantity || 0;
    const itemCostPrice = item.costPrice || 0;
    const itemSellingPrice = item.sellingPrice || 0;

    totalBillAmount += itemCostPrice * itemOrderQuantity;

    if (itemCostPrice > 0) {
      const profitMargin = ((itemSellingPrice - itemCostPrice) / itemCostPrice) * 100;
      totalProfitMargin += profitMargin;
    }

    if (item.item_id) {
      existingItemsCount++;
    } else {
      newItemsCount++;
    }

    if (item.expiryDates && item.expiryDates.length > 0) {
      const hasManuAndExpiry = item.expiryDates.some(
        (dateObj: any) => dateObj.mfgDate && dateObj.date
      );
      if (hasManuAndExpiry) itemsWithManuAndExpiry++;

      const hasShortExpiry = item.expiryDates.some((dateObj: any) =>
        dateObj.mfgDate && dateObj.date
          ? isShelfExpired(dateObj.mfgDate, dateObj.date)
          : false
      );
      if (hasShortExpiry) itemsWithShortExpiry++;
    }
  });

  uniqueItemsCount = existingItemsCount + newItemsCount;

  return {
    totalBillAmount: totalBillAmount.toFixed(2),
    averageProfitMargin: (uniqueItemsCount ? totalProfitMargin / uniqueItemsCount : 0).toFixed(2),
    uniqueItemsCount,
    existingItemsCount,
    newItemsCount,
    itemsWithManuAndExpiry,
    itemsWithShortExpiry,
  };
};