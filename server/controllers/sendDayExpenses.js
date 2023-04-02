const Expense = require('../db-models/expense-model');


const sendDayExpenses = async (request, response, next) => {
  try {
    const date = request.params.date;
    const allExpense = await Expense.find({ date: date });

    let dayTotal = 0;
    if (allExpense.length) {
      dayTotal = await Expense.aggregate([
        {
          $match: {
            date: date,
          },
        },
        {
          $group: {
            _id: '$date',
            amount: {
              $sum: '$amount',
            },
          },
        },
      ]);
    }

    response.status(200).json({
      status: true,
      message: 'expense received',
      data: allExpense,
      dayTotal: dayTotal,
    });
  } catch (error) {
    next(error)
  }
};

module.exports = sendDayExpenses;
