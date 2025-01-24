const Joi = require('joi');

const validateGetItemsSellDetails = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Invalid ID format. Must be a valid MongoDB ObjectId.",
    "any.required": "ID is required.",
  }),
  startDate: Joi.date().iso().required().messages({
    "date.base": "Start date must be a valid date in the format YYYY-MM-DD.",
    "date.format": "Start date must be in the format YYYY-MM-DD.",
    "any.required": "Start date is required.",
  }),
  endDate: Joi.date().iso().required().messages({
    "date.base": "End date must be a valid date in the format YYYY-MM-DD.",
    "date.format": "End date must be in the format YYYY-MM-DD.",
    "any.required": "End date is required.",
  }),
  timePeriod: Joi.string()
    .valid("daywise", "weekly", "monthly", "quarterly", "yearly")
    .required()
    .messages({
      "any.only": "Time period must be one of 'daily', 'weekly', 'monthly', 'quarterly', or 'yearly'.",
      "any.required": "Time period is required.",
    }),
});

module.exports = { validateGetItemsSellDetails };
