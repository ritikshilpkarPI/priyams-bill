const Joi = require('joi');

const validateFile = ({ sizeInMB, fileTypes }) => {
  return Joi.object({
    size: Joi.number()
      .max(sizeInMB * 1024 * 1024) 
      .messages({
        'number.max': `File size must be less than ${sizeInMB}MB`,
      }),

    mimetype: Joi.string()
      .valid(...fileTypes) 
      .messages({
        'any.only': `File must be in one of the following formats: ${fileTypes.join(', ')}`,
      }),
  }).unknown(true);
};

module.exports = { validateFile };
