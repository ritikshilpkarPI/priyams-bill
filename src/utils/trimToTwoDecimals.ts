export const trimToTwoDecimals = (num: any): number => {
    const parsedNum = parseFloat(num);
    
    if (isNaN(parsedNum)) return 0; 
  
    const numStr = parsedNum.toString();
    if (numStr.includes('.')) {
      const [_, decimalPart] = numStr.split('.');
      if (decimalPart.length > 2) {
        return Number(parsedNum.toFixed(2)); 
      }
    }
    return parsedNum;
  };
  