const Joi = require('joi');

const mongoIdSchema = Joi.string()
  .length(24)
  .hex()
  .required();

const isValidMongoId = (id) => {
  const { error } = mongoIdSchema.validate(id);
  return !error; 
};

module.exports = isValidMongoId;
