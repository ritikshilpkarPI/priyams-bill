const { DailyAttendance } = require('../db-models/staff-attendance');

const markAbsent = async (req, res, next) => {
    try {
      const result = new DailyAttendance({
        name: req.body.name,
        arrivingTime: '00',
        date: req.body.date,
        attendance: false,
        leavingTime: '00',
        totalHoursOfWork: 0,
        workHoursCompleted: false,
      });
      await result.save();
      res.status(200).json({ message: result });
    } catch (error) {
      next(error)
    }
  };

  module.exports = markAbsent;
