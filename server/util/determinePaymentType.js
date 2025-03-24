const { CONSTANTS } = require('../constants/constants');

const determinePaymentType = (credits, payments, TPA) => {
  const totalCredit = credits.reduce(
    (sum, c) => sum + Number(c.creditAmount),
    0
  );
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.paidAmount), 0);
  const totalSum = +(totalCredit + totalPaid).toFixed(2);

  const allPaymentDates = payments.map(
    (p) => new Date(p.paymentDate || p.createdAt)
  );
  const allCreditDates = credits.map((c) => new Date(c.payDate || c.createdAt));

  const earliestPaymentDate =
    allPaymentDates.length > 0 ? new Date(Math.min(...allPaymentDates)) : null;
  const earliestCreditDate =
    allCreditDates.length > 0 ? new Date(Math.min(...allCreditDates)) : null;

  if (totalCredit >= TPA && totalPaid === 0) {
    return CONSTANTS.CREDIT;
  }

  if (
    totalSum === TPA &&
    totalCredit > 0 &&
    earliestCreditDate &&
    (!earliestPaymentDate || earliestCreditDate < earliestPaymentDate)
  ) {
    return CONSTANTS.CREDIT;
  }

  if (totalPaid === TPA && totalCredit === 0) {
    return CONSTANTS.FULLY_PAID;
  }

  const multiplePaymentDates =
    allPaymentDates.length > 1 &&
    new Set(allPaymentDates.map((date) => new Date(date).toDateString())).size >
      1;

  if (totalSum === TPA && (totalCredit === 0 || multiplePaymentDates)) {
    return CONSTANTS.PARTIALLY_PAID;
  }

  return CONSTANTS.PARTIALLY_PAID;
};

module.exports = { determinePaymentType };
