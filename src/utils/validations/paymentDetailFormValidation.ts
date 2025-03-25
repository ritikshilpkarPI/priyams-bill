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
    .required('Paid amount is required'),

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