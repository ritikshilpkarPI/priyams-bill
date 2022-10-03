const authRoutes = require('express').Router();
const authController = require('../controllers/auth-controller');

authRoutes.post('/login', authController.loginUser);
authRoutes.get('/logout', authController.logoutUser);

module.exports = authRoutes;