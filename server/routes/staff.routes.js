const Route = require('express').Router();
const staffController = require('../controllers/staff.controller');

Route.get('/staff', staffController.getStaff);
Route.post('/staff', staffController.addStaff);
Route.put('/staff/:username', staffController.updateStaff);
Route.delete('/staff/:username', staffController.deleteStaff);

module.exports = Route;