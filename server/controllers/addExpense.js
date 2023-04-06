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
  
const addExpense = async (request, response, next) => {
    try {
      const expenseItem = new Expense(request.body);
      await expenseItem.save();
      const allExpenses = await allExpense();
      response
        .status(200)
        .json({ status: true, message: 'expense added', data: allExpenses });
    } catch (error) {
      next(error)
    }
  };

  module.exports = addExpense;