import Joi from 'joi';
import mongoose from 'mongoose';

const objectIdValidation = (value: string, helpers: Joi.CustomHelpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.custom', { message: 'Invalid Purchase Order ID' });
  }
  return value;
};

export const validateAddPaymentDetailsById = Joi.object({
  purchaseOrderId: Joi.string().custom(objectIdValidation).required().messages({
      'any.required': 'Purchase Order ID is required',
      'any.custom': 'Invalid Purchase Order ID',
  }),
  payment: Joi.object({
    paidAmount: Joi.number().greater(0).required().messages({
      'number.base': 'Paid Amount must be a number',
      'number.greater': 'Paid Amount must be greater than 0',
      'any.required': 'Paid Amount is required',
    }),
    paidBy: Joi.string().required().messages({
      'string.base': 'Paid By must be a string',
      'string.empty': 'Paid By cannot be empty',
      'any.required': 'Paid By is required',
    }),
    chequeNumber: Joi.when('paidBy', {
      is: Joi.string().valid('CHEQUE').insensitive(),
      then: Joi.string().required().messages({
        'string.base': 'Cheque Number must be a string',
        'string.empty': 'Cheque Number is required for CHEQUE payment',
        'any.required': 'Cheque Number is required for CHEQUE payment',
      }),
      otherwise: Joi.string().valid('').messages({
        'any.only': 'Cheque Number must be empty when Paid By is not CHEQUE',
      }),
    }),
  }).required(),
}).options({ convert: false });
