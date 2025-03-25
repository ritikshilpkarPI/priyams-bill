const { CONSTANTS } = require('../constants/constants');

const calculateTotals = (credits, payments) => {
  const totalCredit = credits.reduce((sum, c) => sum + Number(c.creditAmount), 0);
  const totalPaid = payments.reduce((sum, p) => sum + Number(p.paidAmount), 0);
  const totalSum = +(totalCredit + totalPaid).toFixed(2);

  const allPaymentDates = payments.map((p) => new Date(p.paymentDate || p.createdAt));
  const allCreditDates = credits.map((c) => new Date(c.payDate || c.createdAt));

  const earliestPaymentDate = allPaymentDates.length > 0 ? new Date(Math.min(...allPaymentDates)) : null;
  const earliestCreditDate = allCreditDates.length > 0 ? new Date(Math.min(...allCreditDates)) : null;

  const multiplePaymentDates =
    allPaymentDates.length > 1 &&
    new Set(allPaymentDates.map((date) => new Date(date).toDateString())).size > 1;

  return {
    totalCredit,
    totalPaid,
    totalSum,
    earliestCreditDate,
    earliestPaymentDate,
    multiplePaymentDates,
  };
};

// Each rule is a function that returns the payment type or null
const paymentRules = [
  {
    name: 'Only Credits, Fully Paid',
    condition: ({ totalCredit, totalPaid, TPA }) => totalCredit >= TPA && totalPaid === 0,
    result: CONSTANTS.CREDIT,
  },
  {
    name: 'Credit Before Payment, Combined Fully Paid',
    condition: ({ totalSum, TPA, totalCredit, earliestCreditDate, earliestPaymentDate }) =>
      totalSum === TPA &&
      totalCredit > 0 &&
      earliestCreditDate &&
      (!earliestPaymentDate || earliestCreditDate < earliestPaymentDate),
    result: CONSTANTS.CREDIT,
  },
  {
    name: 'Only Payments, Fully Paid',
    condition: ({ totalPaid, totalCredit, TPA }) => totalPaid === TPA && totalCredit === 0,
    result: CONSTANTS.FULLY_PAID,
  },
  {
    name: 'Mixed or Multiple Dates, Fully Paid',
    condition: ({ totalSum, TPA, totalCredit, multiplePaymentDates }) =>
      totalSum === TPA && (totalCredit === 0 || multiplePaymentDates),
    result: CONSTANTS.PARTIALLY_PAID,
  },
  {
    name: 'Fallback Partial',
    condition: () => true,
    result: CONSTANTS.PARTIALLY_PAID,
  },
];

const determinePaymentType = (credits, payments, TPA) => {
  const context = {
    ...calculateTotals(credits, payments),
    TPA,
  };

  for (const rule of paymentRules) {
    if (rule.condition(context)) {
      // this logging is intentional for prod
      console.log({condition: rule.name})
      return rule.result;
    }
  }

  // Ideally never reached
  throw new Error('No matching payment condition found.');
};

module.exports = { determinePaymentType };
