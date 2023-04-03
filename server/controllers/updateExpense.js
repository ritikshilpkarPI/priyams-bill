const Expense = require('../db-models/expense-model');

const allExpense = async () =>
  await Expense.aggregate([
    {
      $group: {
        _id: '$date',
        amount: {
          $sum: '$amount',
        },
      },
    },
  ]).sort({ _id: -1 });

const updateExpense = async (request, response,next) => {
    try {
      const id = request.params.id;
      await Expense.findByIdAndUpdate(id, request.body);
      const allExpenses = await allExpense();
      response
        .status(200)
        .json({ status: true, message: 'expense updated', data: allExpenses });
    } catch (error) {
      next(error)
    }
  };

  module.exports = updateExpense;