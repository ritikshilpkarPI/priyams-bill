export const fixedToTwoDecimalPlace = (num: string | number): number => {
  const parsedNum = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(parsedNum)) return 0;

  return Number(parsedNum.toFixed(2)); 
};
