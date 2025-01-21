const { convertToISTAndISO } = require('./convertToISTandISO');

const groupByFilter = (date, filter) => {
  const formattedDate = new Date(convertToISTAndISO(date));
  const year = formattedDate.getFullYear();

  switch (filter) {
    case 'monthly':
      return `${year}-${String(formattedDate.getMonth() + 1).padStart(2, '0')}`;
    case 'weekly':
      const dayOfWeek = formattedDate.getDay();
      const startOfWeek = new Date(formattedDate);
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
      return startOfWeek.toISOString().slice(0, 10);
    case 'daywise':
      return formattedDate.toISOString().slice(0, 10);
    case 'quarterly':
      const quarter = Math.floor(formattedDate.getMonth() / 3);
      const startMonth = quarter * 3;
      return `${year}-${String(startMonth + 1).padStart(2, '0')}`;
    case 'yearly':
      return `${year}`;
    default:
      return null;
  }
};

const generateIntervals = (startDate, endDate, filter) => {
  const intervals = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    switch (filter) {
      case 'monthly':
        intervals.push(
          `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(
            2,
            '0'
          )}`
        );
        current.setMonth(current.getMonth() + 1);
        break;
      case 'weekly':
        const startOfWeek = new Date(current);
        const dayOfWeek = startOfWeek.getDay();
        const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
        intervals.push(startOfWeek.toISOString().slice(0, 10));
        current.setDate(current.getDate() + 7);
        break;
      case 'daywise':
        intervals.push(current.toISOString().slice(0, 10));
        current.setDate(current.getDate() + 1);
        break;
      case 'quarterly':
        const year = current.getFullYear();
        const quarter = Math.floor(current.getMonth() / 3);
        const startMonth = quarter * 3;
        intervals.push(`${year}-${String(startMonth + 1).padStart(2, '0')}`);
        current.setMonth(current.getMonth() + 3);
        break;
      case 'yearly':
        intervals.push(`${current.getFullYear()}`);
        current.setFullYear(current.getFullYear() + 1);
        break;
      default:
        break;
    }
  }

  return intervals;
};

module.exports = { groupByFilter, generateIntervals };
