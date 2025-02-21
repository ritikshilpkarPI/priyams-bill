export const isShelfExpired = (mfgDate, expDate) => {
    const currentDate = new Date();
  
    const mfg = new Date(mfgDate);
    const exp = new Date(expDate);
  
    const totalDays = (exp - mfg) / (1000 * 60 * 60 * 24);
  
    const daysRemaining = (exp - currentDate) / (1000 * 60 * 60 * 24);
  
    const percentageExpired = (daysRemaining / totalDays) * 100;
  
    return percentageExpired < 50;
  };
  
