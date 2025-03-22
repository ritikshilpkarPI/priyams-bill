import * as Yup from 'yup';

export const paymentDetailFormValidation = Yup.object().shape({
  totalBillAmount: Yup.number()
    .moreThan(0, 'Total bill amount must be greater than 0')
    .required('Total bill amount is required'),

  totalPayableAmount: Yup.number()
    .moreThan(0, 'Total payable amount must be greater than 0')
    .required('Total payable amount is required'),

  paymentType: Yup.string()
    .required('Payment type is required'),

  remark: Yup.string().test(
    'remarks-required-if-amounts-differ',
    'Remarks are required when bill or payable amount doesn’t match total items cost.',
    function (value) {
      const { totalBillAmount, totalPayableAmount, totalItemsCost } = this.parent;
      
      const isMismatch = (
        totalBillAmount !== totalItemsCost ||
        totalPayableAmount !== totalItemsCost
      );

      if (isMismatch && !value?.trim()) {
        return false;
      }

      return true;
    }
  ),
});

export const addCreditDetailValidation = Yup.object().shape({
  creditAmount: Yup.number()
    .moreThan(0, 'Credit amount must be greater than 0')
    .required('Credit amount is required'),

  payDate: Yup.date()
    .required('Pay date is required')
});

export const addPaymentDetailValidation = Yup.object().shape({
  paidBy: Yup.string()
  .required('Payment method is required'),

  paidAmount: Yup.number()
    .moreThan(0, 'Paid amount must be greater than 0')
    .required('Paid amount is required').test(
      'total-payments-not-exceed-tpa',
      'Total of all payments cannot exceed Total Payable Amount (TPA)',
      function (value) {
        const { paymentsList = [] as paymentsType[] , totalPayableAmount } = this.parent;
  
        const previousPayments = paymentsList.reduce(
          (sum : number, payment : paymentsType ) => sum + (payment?.paidAmount || 0),
          0
        );
        
        // Add current input amount and compare
        return previousPayments + (value || 0) <= (totalPayableAmount || 0);
      }
    ),

    paymentImages: Yup.array()
    .of(
      Yup.mixed()
        .test('fileType', 'Only image files are allowed', (value) => {
          return value instanceof File && ['image/png', 'image/jpeg', 'image/jpg'].includes(value.type);
        })
        .test('fileSize', 'File size should not exceed 5MB', (value) => {
          return value instanceof File && value.size <= 5 * 1024 * 1024;
        })
    )
    .when('paidBy', {
      is: (paidBy: string) =>
        paidBy?.toLowerCase() === 'upi' || paidBy?.toLowerCase() === 'neft',
      then: (schema) => schema.min(1, 'At least one payment image is required for UPI/NEFT'),
      otherwise: (schema) => schema.optional(),
    }),
});


export const PaymentCoverageComplete = Yup.object().shape({
  isPaymentCoverageComplete: Yup.boolean().test(
    'if-credits-and-payments-not-exceed-tpa',
    'Total of all payments and credits must be greater than or equal to Total Payable Amount (TPA)',
    function () {
      const { totalPayableAmount, payments = [], credits = [] } = this.parent;
      
      const totalPayments = payments.reduce((sum: number, p: paymentsType) => sum + (p?.paidAmount || 0), 0);
      const totalCredits = credits.reduce((sum: number, c: creditsType) => sum + (c?.creditAmount || 0), 0);
      const totalAmountCovered = totalPayments + totalCredits;
      console.log({ totalPayableAmount, totalAmountCovered});
      
      // Enforce that checkbox can only be true when condition is met
      if (totalAmountCovered < totalPayableAmount) {
        return false;
      }
  
      return true;
    }
  )
});