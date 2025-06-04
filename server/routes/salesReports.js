const express = require('express');
const router = express.Router();
const { getSalesReport } = require('../controllers/salesReports');

// Route for getting sales reports
router.post('/reports', getSalesReport);

module.exports = router; 