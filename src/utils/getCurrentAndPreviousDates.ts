const convertDateToISO = (date: Date): string => {
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
    .toISOString()
    .slice(0, 10);
};
export const getCurrentAndPreviousDates = (monthsAgo: number) => {
  const currentDate = new Date();
  const previousMonthDate = new Date();
  previousMonthDate.setMonth(currentDate.getMonth() - monthsAgo);

  return {
    currentDate: convertDateToISO(currentDate),
    previousDate: convertDateToISO(previousMonthDate),
  };
};