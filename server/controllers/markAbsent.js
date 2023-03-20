const { DailyAttendance } = require('../db-models/staff-attendance');

const markAbsent = async (req, res) => {
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
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = markAbsent;
