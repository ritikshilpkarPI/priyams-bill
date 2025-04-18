import { MESSAGES } from '../constants/messages';

export const getValidDateRange = (startDate?: string, endDate?: string) => {
  const start = startDate
    ? new Date(startDate)
    : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    throw { status: 400, message: MESSAGES.INVALID_DATE_RANGE };
  }
  return { start, end };
};
