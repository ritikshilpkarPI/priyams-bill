const Joi = require('joi');

const validateUpsertPODealerRequest = Joi.object({
  dealerId: Joi.string().optional(),

  dealerName: Joi.string()
    .trim()
    .when('dealerId', {
      is: Joi.exist().not(null),
      then: Joi.optional(),
      otherwise: Joi.required().messages({ 'any.required': 'Dealer name is required when dealerId is not provided' }),
    })
    .custom((value, helpers) => {
      if (!value || value.trim().length === 0) {
        return helpers.error('string.invalid');
      }
      return value;
    })
    .messages({ 'string.invalid': 'Dealer name cannot be empty or contain only spaces' }),

 
    dealerAddress: Joi.array()
    .items(
      Joi.object({
        address: Joi.string().required().messages({ 'any.required': 'Address is required' }),
        updatedAt: Joi.date().default(Date.now),
      }).required()
    )
    .min(1)
    .messages({
      'array.min': 'At least one dealer address is required',
    })
    .when('dealerId', {
      is: Joi.exist().not(null),
      then: Joi.optional(),
      otherwise: Joi.required().messages({ 'any.required': 'Dealer address is required when dealerId is not provided' }),
    }),
  
  
    dealerContactNumber: Joi.array()
    .items(
      Joi.object({
        contactNumber: Joi.string().required().messages({ 'any.required': 'Contact number is required' }),
        updatedAt: Joi.date().default(Date.now),
      }).required()
    )
    .min(1)
    .messages({
      'array.min': 'At least one dealer contact number is required',
    })
    .when('dealerId', {
      is: Joi.exist().not(null),
      then: Joi.optional(),
      otherwise: Joi.required().messages({ 'any.required': 'Dealer contact number is required when dealerId is not provided' }),
    }),
  


  salesmanId: Joi.string().optional(),

  salesmanName: Joi.string()
    .trim()
    .when('salesmanId', {
      is: Joi.exist().not(null),
      then: Joi.optional(),
      otherwise: Joi.required().messages({ 'any.required': 'Salesman name is required when salesmanId is not provided' }),
    })
    .custom((value, helpers) => {
      if (!value || value.trim().length === 0) {
        return helpers.error('string.invalid');
      }
      return value;
    })
    .messages({ 'string.invalid': 'Salesman name cannot be empty or contain only spaces' }),

    salesmanContactNumber: Joi.array()
    .items(
      Joi.object({
        contactNumber: Joi.string().required().messages({ 'any.required': 'Contact number is required' }),
        updatedAt: Joi.date().default(Date.now),
      }).required()
    )
    .min(1)
    .messages({
      'array.min': 'At least one salesman contact number is required',
    })
    .when('salesmanId', {
      is: Joi.exist().not(null),
      then: Joi.optional(),
      otherwise: Joi.required().messages({ 'any.required': 'Salesman contact number is required when salesmanId is not provided' }),
    }),
  
}).unknown(true);

module.exports = { validateUpsertPODealerRequest };
