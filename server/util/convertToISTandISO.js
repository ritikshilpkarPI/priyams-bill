const convertToISTAndISO = (date) => {
  const istDate = new Date(
    date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })
  );

  const isoDate = istDate.toISOString();

  return isoDate;
};
module.exports = { convertToISTAndISO };
