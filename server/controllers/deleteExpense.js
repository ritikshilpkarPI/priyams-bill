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
const deleteExpense = async (request, response,next) => {
    try {
      const id = request.params.id;
      await Expense.findByIdAndDelete(id);
      const allExpenses = await allExpense();
      response
        .status(200)
        .json({ status: true, message: 'expense deleted', data: allExpenses });
    } catch (error) {
      next(error)
    }
  };

  module.exports = deleteExpense;