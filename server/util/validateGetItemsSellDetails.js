const Joi = require('joi');
const { convertDateToIST } = require('./convertDateToIST');

const isValidDate = (dateString) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateString;
};

const validateGetItemsSellDetails = Joi.object({
  id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Invalid ID format. Must be a valid MongoDB ObjectId.",
    "any.required": "ID is required.",
  }),
  intervals: Joi.array()
    .items(
      Joi.object({
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
        const { startDate, endDate } = value;
        const errors = [];

        if (!isValidDate(startDate)) {
          errors.push("Start date is not a valid calendar date.");
        }

        if (!isValidDate(endDate)) {
          errors.push("End date is not a valid calendar date.");
        }

        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        if (startDateObj > endDateObj) {
          errors.push("Start date must be less than or equal to the end date.");
        }

        if (errors.length > 0) {
          return helpers.message(errors.join(" "));
        }

        return value;
      })
    )
    .required()
    .messages({
      "any.required": "Intervals are required.",
    }),
}).custom((value, helpers) => {
  if (!Array.isArray(value.intervals)) {
    return helpers.message("Intervals must be an array of objects.");
  }

  const currentDateOnly = convertDateToIST(new Date()).toISOString().slice(0, 10);

  for (const interval of value.intervals) {
    const endDateOnly = convertDateToIST(new Date(interval.endDate)).toISOString().slice(0, 10);

    if (endDateOnly > currentDateOnly) {
      return helpers.message("End date should not be greater than today's date.");
    }
  }

  return value;
});

module.exports = { validateGetItemsSellDetails };
