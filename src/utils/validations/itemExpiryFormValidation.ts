import Yup from "yup";
export const itemExpiryFormValidation = Yup.object({
    date: Yup.date().required('Expiry Date is required.'),
    mfgDate: Yup.date().required('Mfg Date is required.'),
    value: Yup.number().min(1, 'Qty. should be greater than 0').required('Quantity is required.'),
  }).test('expiry-date-after-mfg-date', 'Expiry Date must be later than Mfg Date.', function(value) {
    const { date, mfgDate } = value;
    if (date <= mfgDate) {
      return this.createError({ message: 'Expiry Date must be later than Mfg Date.' });
    }
    return true;
});