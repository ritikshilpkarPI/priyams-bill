const Joi = require('joi');

const validateUpsertPODealerRequest = Joi.object({
  dealerId: Joi.string().optional(),

  dealerName: Joi.string().when('dealerId', {
    is: Joi.exist().not(null),
    then: Joi.optional(),
    otherwise: Joi.required().messages({ 'any.required': 'Dealer name is required when dealerId is not provided' }),
  }),

  dealerAddress: Joi.array()
    .items(
      Joi.object({
        address: Joi.string().required(),
        updatedAt: Joi.date().default(Date.now),
      })
    )
    .when('dealerId', {
      is: Joi.exist().not(null),
      then: Joi.optional(),
      otherwise: Joi.required().messages({ 'any.required': 'Dealer address is required when dealerId is not provided' }),
    }),

  dealerContactNumber: Joi.array()
    .items(
      Joi.object({
        contactNumber: Joi.string().required(),
        updatedAt: Joi.date().default(Date.now),
      })
    )
    .when('dealerId', {
      is: Joi.exist().not(null),
      then: Joi.optional(),
      otherwise: Joi.required().messages({ 'any.required': 'Dealer contact number is required when dealerId is not provided' }),
    }),

  salesmanId: Joi.string().optional(),

  salesmanName: Joi.string().when('salesmanId', {
    is: Joi.exist().not(null),
    then: Joi.optional(),
    otherwise: Joi.required().messages({ 'any.required': 'Salesman name is required when salesmanId is not provided' }),
  }),

  salesmanContactNumber: Joi.array()
    .items(
      Joi.object({
        contactNumber: Joi.string().required(),
        updatedAt: Joi.date().default(Date.now),
      })
    )
    .when('salesmanId', {
      is: Joi.exist().not(null),
      then: Joi.optional(),
      otherwise: Joi.required().messages({ 'any.required': 'Salesman contact number is required when salesmanId is not provided' }),
    }),
}).unknown(true);

module.exports = { validateUpsertPODealerRequest };
