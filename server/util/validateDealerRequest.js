const Joi = require('joi');
const validateFile = Joi.object({
    file: Joi.object({
      size: Joi.number()
        .max(5 * 1024 * 1024) 
        .required()
        .messages({
          'number.max': 'File size must be less than 5MB',
        }),
      mimetype: Joi.string()
        .valid('image/jpeg', 'image/jpg', 'image/png')
        .required()
        .messages({
          'string.valid': 'File must be in jpg, jpeg, or png format',
        }),
    }).required(),
  });
const validateDealerRequest = Joi.object({
  dealerName: Joi.when('dealerId', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.string().required(),
  }),
  dealerAddress: Joi.when('dealerId', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.array()
      .items(
        Joi.object({
          address: Joi.string().required(),
          updatedAt: Joi.date().default(Date.now),
        })
      )
      .required(),
  }),
  dealerContactNumber: Joi.when('dealerId', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.array()
      .items(
        Joi.object({
          contactNumber: Joi.string().required(),
          updatedAt: Joi.date().default(Date.now),
        })
      )
      .required(),
  }),


  salesmanName: Joi.when('salesmanId', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.string().required(),
  }),
  salesmanContactNumber: Joi.when('salesmanId', {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.array()
      .items(
        Joi.object({
          contactNumber: Joi.string().required(),
          updatedAt: Joi.date().default(Date.now),
        })
      )
      .required(),
  }),

  dealerId: Joi.when(
    Joi.object({
      dealerName: Joi.required(),
      dealerAddress: Joi.required(),
      dealerContactNumber: Joi.required(),
      dealerVisitingCard: Joi.required(),
      salesmanName: Joi.required(),
      salesmanContactNumber: Joi.required(),
    }),
    {
      then: Joi.optional(),
      otherwise: Joi.string().optional(),
    }
  ),
  salesmanId: Joi.when(
    Joi.object({
      dealerName: Joi.required(),
      dealerAddress: Joi.required(),
      dealerContactNumber: Joi.required(),
      dealerVisitingCard: Joi.optional(),
      salesmanName: Joi.required(),
      salesmanContactNumber: Joi.required(),
    }),
    {
      then: Joi.optional(),
      otherwise: Joi.string().optional(),
    }
  ),
}).unknown(true);

module.exports = { validateDealerRequest, validateFile };
