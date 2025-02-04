import { convertDateToISO } from "./convertDateToISO";

export const getDateBeforeMonths = (monthsAgo: number) => {
  const currentDate = new Date();
  const previousMonthDate = new Date();
  previousMonthDate.setMonth(currentDate.getMonth() - monthsAgo);

  return convertDateToISO(previousMonthDate)
  
};