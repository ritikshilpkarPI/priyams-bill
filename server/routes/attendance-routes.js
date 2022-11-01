const attendanceRoutes = require('express').Router();
const { addDailyAttendanceArrival, addDailyAttendanceLeaving, getDatesWiseAttendance } = require('../controllers/daily-attendance-controller');

attendanceRoutes.post('/dailyAttendanceArrival', addDailyAttendanceArrival);
attendanceRoutes.post('/dailyAttendanceLeaving', addDailyAttendanceLeaving);
attendanceRoutes.post('/dailyAttendance', getDatesWiseAttendance);

module.exports = attendanceRoutes;