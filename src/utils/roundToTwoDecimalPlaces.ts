export const roundToTwoDecimalPlaces = (num: string | number): number => {
  const parsedNum = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(parsedNum)) return 0;

  return Math.round(parsedNum * 100) / 100;
};
