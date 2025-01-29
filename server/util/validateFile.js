const Joi = require('joi');

const validateFile = Joi.object({
  size: Joi.number()
    .max(5 * 1024 * 1024) 
    .messages({
      'number.max': 'File size must be less than 5MB',
    }),

  mimetype: Joi.string()
    .valid('image/jpeg', 'image/jpg', 'image/png')
    .messages({
      'any.only': 'File must be in jpg, jpeg, or png format',
    }),
}).unknown(true); 

module.exports = { validateFile };
