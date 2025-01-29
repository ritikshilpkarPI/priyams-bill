export const getCurrentAndPreviousDates = (monthsAgo: number) => {
  const currentDate = new Date();
  const previousMonthDate = new Date();
  previousMonthDate.setMonth(currentDate.getMonth() - monthsAgo); 

  const formatDate = (date: Date): string => {
    return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
      .toISOString()
      .slice(0, 10);
  };

  return {
    currentDate: formatDate(currentDate),
    previousDate: formatDate(previousMonthDate),
  };
  };