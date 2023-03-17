const { DailyAttendance } = require('../db-models/staff-attendance');

const addDailyAttendanceArrival = async (req, res) => {
  try {
    let checkInside = await DailyAttendance.find({
      name: req.body.name,
      date: req.body.date,
    });

    if (!checkInside.length) {
      let attendance = new DailyAttendance({
        name: req.body.name,
        arrivingTime: new Date(Date.now()),
        date: req.body.date,
        attendance: req.body.attendance,
        todaysLeave: false,
      });
      await attendance.save();
      res.status(200).json({ message: attendance });
    } else {
      res
        .status(230)
        .json({ message: 'You have already put attendance for today' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  addDailyAttendanceArrival,
};
