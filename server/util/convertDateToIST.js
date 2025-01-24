const convertDateToIST = (date) => {
    return new Date(
      date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
    );
  };
  
module.exports = { convertDateToIST };
  