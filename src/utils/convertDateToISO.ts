export const convertDateToISO = (date: Date): string => {
    return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
      .toISOString()
      .slice(0, 10);
  };