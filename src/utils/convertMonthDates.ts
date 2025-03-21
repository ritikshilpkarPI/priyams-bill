
 export const convertMonthDates = (data: soldItemsByDateInterface[]): soldItemsByDateInterface[] => {
    return data.map(({ date, value }) => {
      const dateObj = new Date(`${date}`);
      const formattedDate = `${dateObj.getFullYear()}-${dateObj.toLocaleString('en-US', { month: 'short' })}`;
      return { date: formattedDate, value };
    });
  };

 