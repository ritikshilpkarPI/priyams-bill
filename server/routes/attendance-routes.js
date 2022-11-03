const attendanceRoutes = require('express').Router();
const { addDailyAttendanceArrival, addDailyAttendanceLeaving, getDatesWiseAttendance, getMonthlyAttendance } = require('../controllers/daily-attendance-controller');

attendanceRoutes.post('/dailyAttendanceArrival', addDailyAttendanceArrival);
attendanceRoutes.post('/dailyAttendanceLeaving', addDailyAttendanceLeaving);
attendanceRoutes.post('/dailyAttendance', getDatesWiseAttendance);
attendanceRoutes.get('/monthlyAttendance', getMonthlyAttendance);

module.exports = attendanceRoutes;