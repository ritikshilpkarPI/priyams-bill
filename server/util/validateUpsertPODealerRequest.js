const Joi = require('joi');

const validateUpsertPODealerRequest = Joi.object({
  dealerId: Joi.string().optional(),

  dealerName: Joi.string()
    .trim()
    .when('dealerId', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required().messages({ 'any.required': 'Dealer name is required when dealerId is not provided' }),
    })
    .custom((value, helpers) => {
      if (value.trim().length === 0) {
        return helpers.error('string.empty');
      }
      return value;
    })
    .messages({ 'string.empty': 'Dealer name cannot be empty or contain only spaces' }),

  dealerAddress: Joi.string()
    .trim()
    .when('dealerId', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required().messages({ 'any.required': 'Dealer address is required when dealerId is not provided' }),
    })
    .messages({ 'string.empty': 'Dealer address cannot be empty or contain only spaces' }),

  dealerContactNumber: Joi.string()
    .trim()
    .custom((value, helpers) => {
      const trimmedValue = value.trim(); 
      if (!trimmedValue.match(/^\d{10}$/)) {
        return helpers.error('string.pattern.base');
      }
      return trimmedValue;
    })
    .when('dealerId', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required().messages({ 'any.required': 'Dealer contact number is required when dealerId is not provided' }),
    })
    .messages({
      'string.pattern.base': 'Dealer contact number must be exactly 10 digits',
    }),

  salesmanId: Joi.string().optional(),

  salesmanName: Joi.string()
    .trim()
    .when('salesmanId', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required().messages({ 'any.required': 'Salesman name is required when salesmanId is not provided' }),
    })
    .custom((value, helpers) => {
      if (value.trim().length === 0) {
        return helpers.error('string.empty');
      }
      return value;
    })
    .messages({ 'string.empty': 'Salesman name cannot be empty or contain only spaces' }),


  salesmanContactNumber: Joi.string()
    .trim()
    .custom((value, helpers) => {
      const trimmedValue = value.trim();
      if (!trimmedValue.match(/^\d{10}$/)) {
        return helpers.error('string.pattern.base');
      }
      return trimmedValue;
    })
    .when('salesmanId', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required().messages({ 'any.required': 'Salesman contact number is required when salesmanId is not provided' }),
    })
    .messages({
      'string.pattern.base': 'Salesman contact number must be exactly 10 digits',
    }),

  dealerVisitingCard: Joi.string().optional(),
}).unknown(true);

module.exports = { validateUpsertPODealerRequest };
