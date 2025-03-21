import { formatShortDate } from "./formatDate";

export const formatSoldItemsByDate = (soldItems: soldItemsByDateInterface[]) => {
  return soldItems.map((item) => ({
    ...item,
    date: formatShortDate(item.date),
  }));
};