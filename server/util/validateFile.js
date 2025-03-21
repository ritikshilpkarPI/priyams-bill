const Joi = require('joi');

const validateFile = ({ sizeInMB, fileTypes }) => {
  return (file) => {
    const schema = Joi.object({
      mimetype: Joi.string()
        .valid(...fileTypes)
        .required()
        .messages({
          'any.only': `File must be in one of the following formats: ${fileTypes.join(', ')}`,
          'any.required': 'File type is required',
        }),

      size: Joi.number()
        .max(sizeInMB * 1024 * 1024)
        .required()
        .messages({
          'number.max': `File size must be less than ${sizeInMB}MB`,
          'any.required': 'File size is required',
        }),
    }).unknown(true);

    return schema.validate(file);
  };
};

module.exports = { validateFile };
