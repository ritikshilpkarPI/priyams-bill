const Joi = require('joi');

const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/; 
  if (!regex.test(dateString)) return false; 

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateString;
};

const validateGetItemsSellDetails = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Invalid ID format. Must be a valid MongoDB ObjectId.",
    "any.required": "ID is required.",
  }),
  startDate: Joi.string().required().messages({
    "any.required": "Start date is required.",
  }),
  endDate: Joi.string().required().messages({
    "any.required": "End date is required.",
  }),
  timePeriod: Joi.string()
    .valid("daywise", "weekly", "monthly", "quarterly", "yearly")
    .required()
    .messages({
      "any.only": "Time period must be one of 'daywise', 'weekly', 'monthly', 'quarterly', or 'yearly'.",
      "any.required": "Time period is required.",
    }),
}).custom((value, helpers) => {
  const startDate = value.startDate;
  const endDate = value.endDate;

  const errors = [];

  if (!isValidDate(startDate)) {
    errors.push("Start date is not a valid calendar date.");
  }

  if (!isValidDate(endDate)) {
    errors.push("End date is not a valid calendar date.");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(' '));
  }

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  if (startDateObj > endDateObj) {
    throw new Error("Start date must be less than or equal to the end date.");
  }

  return value;
});

module.exports = { validateGetItemsSellDetails };
