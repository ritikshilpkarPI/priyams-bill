export const formatShortDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return `${date.getFullYear()}-${date.toLocaleString('en-US', { month: 'short' })}-${date.getDate()}`;
  };