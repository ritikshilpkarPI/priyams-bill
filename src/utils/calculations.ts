export const calculateWeeklyAverage = (item: any, dates: string[]) => {
  const totalDays = dates.length;
  if (totalDays < 7) return null;

  const quantityMap: Record<string, number> = {};
  if (item.itemBillingTrend) {
    item.itemBillingTrend.forEach((entry: any) => {
      const date = new Date(entry.date).toISOString().split('T')[0];
      quantityMap[date] = (quantityMap[date] || 0) + entry.quantity;
    });
  }

  const totalQuantity = Object.values(quantityMap).reduce(
    (sum, quantity) => sum + quantity,
    0
  );
  const weeks = totalDays / 7;

  return Number((totalQuantity / weeks).toFixed(2));
}; 