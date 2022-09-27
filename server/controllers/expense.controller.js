const Expense = require('../db-models/expense.model');

const addExpense = async (request, response) => {
    try {
        const expenseItem = await new Expense(request.body);
        expenseItem.save();
        response.status(200).json({ status: true, message: 'expense added' });
    } catch (error) {
        response.status(500).json({ error });
    }
}

const deleteExpense = async (request, response) => {
    try {
        const id = request.params.id;
        const deletedItem = await Expense.findByIdAndDelete(id);
        response.status(200).json({ status: true, message: 'expense deleted', data: deletedItem });
    } catch (error) {
        response.status(500).json({ error });
    }
}

const sendAllExpense = async (request, response) => {
    try {
        const allExpense = await Expense.aggregate([
            {
                $group: {
                    _id: "$date",
                    amount: {
                        $sum: "$amount"
                    }
                }
            }
        ]).sort({ _id: -1 });

        response.status(200).json({ status: true, message: 'expense received', data: allExpense });
    } catch (error) {
        response.status(500).json({ error });
    }
}

const updateExpense = async (request, response) => {
    try {
        const id = request.params.id;
        const updatedExpense = await Expense.findByIdAndUpdate(id, request.body);
        response.status(200).json({ status: true, message: 'expense updated', data: updatedExpense });
    } catch (error) {
        response.status(500).json({ error });
    }
}

const sendDayExpenses = async (request, response) => {
    try {
        const date = request.params.date;
        const allExpense = await Expense.find({ date: date })
        response.status(200).json({ status: true, message: 'expense received', data: allExpense });
    } catch (error) {
        response.status(500).json({ error });
    }
};

module.exports = { addExpense, deleteExpense, sendAllExpense, updateExpense, sendDayExpenses }