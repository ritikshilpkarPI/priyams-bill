export const getCurrentAndPreviousYearDates = () => {
    const currentDate = new Date();
    const previousYearDate = new Date();
    previousYearDate.setFullYear(currentDate.getFullYear() - 1);
  
    const formatDate = (date: Date): string => {
      return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
        .toISOString()
        .slice(0, 10);
    };
    return {
      currentDate: formatDate(currentDate),
      previousYearDate: formatDate(previousYearDate),
    };
  };