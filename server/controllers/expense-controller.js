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
    response.status(500).json({ error });
  }
};

const deleteExpense = async (request, response) => {
  try {
    const id = request.params.id;
    await Expense.findByIdAndDelete(id);
    const allExpenses = await allExpense();
    response
      .status(200)
      .json({ status: true, message: 'expense deleted', data: allExpenses });
  } catch (error) {
    response.status(500).json({ error });
  }
};

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

const updateExpense = async (request, response) => {
  try {
    const id = request.params.id;
    await Expense.findByIdAndUpdate(id, request.body);
    const allExpenses = await allExpense();
    response
      .status(200)
      .json({ status: true, message: 'expense updated', data: allExpenses });
  } catch (error) {
    response.status(500).json({ error });
  }
};

const sendDayExpenses = async (request, response) => {
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
    response.status(500).json({ error });
  }
};

module.exports = {
  addExpense,
  deleteExpense,
  sendAllExpense,
  updateExpense,
  sendDayExpenses,
};
