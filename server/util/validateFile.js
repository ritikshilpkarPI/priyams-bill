const Joi = require('joi');

const validateFile = ({ sizeInMB, fileTypes }) => {
  return Joi.alternatives().try(
    Joi.object({
      mimetype: Joi.string()
        .valid(...fileTypes)
        .messages({
          'any.only': `File must be in one of the following formats: ${fileTypes.join(', ')}`,
        }),

      size: Joi.number()
        .max(sizeInMB * 1024 * 1024) 
        .messages({
          'number.max': `File size must be less than ${sizeInMB}MB`,
        }),
    }).unknown(true),

    Joi.array()
      .max(1)
      .messages({
        'array.max': 'Only one file can be uploaded at a time',
      })
  );
};

module.exports = { validateFile };
