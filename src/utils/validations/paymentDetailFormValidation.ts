import * as Yup from "yup";

export const paymentDetailFormValidation = Yup.object({
    paidBy: Yup.string().required('Payment method is required'), 
    paidAmount: Yup.number()
      .moreThan(0, 'Paid amount must be greater than 0')
      .required('Paid amount is required'),
    chequeNumber: Yup.string()
      .notRequired()  
      .nullable()  
});