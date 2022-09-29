const Route = require('express').Router();
const ExpenseController = require('../controllers/expense.controller');

Route.get('/expense', ExpenseController.sendAllExpense);
Route.post('/expense', ExpenseController.addExpense);
Route.delete('/expense/:id', ExpenseController.deleteExpense);
Route.put('/expense/:id', ExpenseController.updateExpense);
Route.get('/expense/:date', ExpenseController.sendDayExpenses);

module.exports = Route;