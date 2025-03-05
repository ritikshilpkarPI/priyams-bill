const getDaysBetweenDates = (
    startDate: string | Date,
    endDate: string | Date
  ): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0;
    }
  
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };
  
  export { getDaysBetweenDates };
  