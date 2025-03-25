import * as Yup from 'yup';

export const dealerFormValidation = Yup.object({
  billAmount: Yup.number()
    .min(1, 'Bill amount must be greater than 0.')
    .required('Bill amount is required.'),
  procurementSource: Yup.string(),
  dealerName: Yup.string().required('Dealer name is required.'),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits.')
    .required('Phone number is required.'),
  remark: Yup.string().optional(),
});
