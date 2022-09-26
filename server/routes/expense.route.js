const Route = require('express').Router();
const ExpenseController = require('../controllers/expense.controller');

Route.get('/expense', ExpenseController.sendAllExpense);
Route.post('/expense', ExpenseController.addExpense);
Route.put('/expense', ExpenseController.updateExpense);
Route.get('/expense/:date', ExpenseController.sendDayExpenses);

module.exports = Route;