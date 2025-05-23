export const formatToISTTime = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { timeZone: 'IST' });
}
