const attendanceRoutes = require('express').Router();
const { addDailyAttendanceArrival, addDailyAttendanceLeaving } = require('../controllers/daily-attendance-controller');

attendanceRoutes.post('/dailyAttendanceArrival', addDailyAttendanceArrival);
attendanceRoutes.post('/dailyAttendanceLeaving', addDailyAttendanceLeaving);

module.exports = attendanceRoutes;