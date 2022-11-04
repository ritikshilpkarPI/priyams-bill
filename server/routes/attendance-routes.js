const attendanceRoutes = require('express').Router();
const { addDailyAttendanceArrival, addDailyAttendanceLeaving, getDatesWiseAttendance, getMonthlyAttendance, markAbsent } = require('../controllers/daily-attendance-controller');

attendanceRoutes.post('/dailyAttendanceArrival', addDailyAttendanceArrival);
attendanceRoutes.post('/dailyAttendanceLeaving', addDailyAttendanceLeaving);
attendanceRoutes.post('/dailyAttendance', getDatesWiseAttendance);
attendanceRoutes.post('/markAbsent', markAbsent);
attendanceRoutes.get('/monthlyAttendance', getMonthlyAttendance);

module.exports = attendanceRoutes;