export const roundNumber = (value: string | number): number => {
    if (typeof value === 'number') {
      return Math.round(value);
    }
  
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      if (!isNaN(parsed)) {
        return Math.round(parsed);
      }
    }
  
    return 0; 
  };
  