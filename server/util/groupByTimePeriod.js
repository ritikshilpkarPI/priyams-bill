const groupByTimePeriod = (date, timePeriod) => {
  const year = date.getFullYear();

  switch (timePeriod) {
    case 'monthly':
      return `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    case 'weekly':
      const dayOfWeek = date.getDay();
      const startOfWeek = new Date(date);
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
      return startOfWeek.toISOString().slice(0, 10);
    case 'daywise':
      return date.toISOString().slice(0, 10);
    case 'quarterly':
      const quarter = Math.floor(date.getMonth() / 3);
      const startMonth = quarter * 3;
      return `${year}-${String(startMonth + 1).padStart(2, '0')}`;
    case 'yearly':
      return `${year}`;
    default:
      return null;
  }
};


module.exports = { groupByTimePeriod };
