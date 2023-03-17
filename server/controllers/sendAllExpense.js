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


async function sendAllExpense(request, response) {
    try {
      const allExpenses = await allExpense();
      response
        .status(200)
        .json({ status: true, message: 'expense received', data: allExpenses });
    } catch (error) {
      response.status(500).json({ error });
    }
  }

  module.exports = {
    sendAllExpense,
  };