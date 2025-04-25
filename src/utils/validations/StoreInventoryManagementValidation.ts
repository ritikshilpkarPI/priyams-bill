import * as Yup from 'yup';

export const sourceValidation = Yup.object({
  sourceStaff: Yup.string().required('Source staff is required'),
  sourceEntityId: Yup.string().required('Source entity ID is required'),
  sourceType: Yup.string()
    .required('Source type is required'),
});

export const destinationValidation = Yup.object({
  destinationStaff: Yup.string().required('Destination staff is required'),
  destinationEntityId: Yup.string().required(
    'Destination entity ID is required'
  ),
  destinationType: Yup.string()
    .required('Destination type is required'),
});

export const transactionReasonValidation  = Yup.string().required('Transaction Reason is required')


