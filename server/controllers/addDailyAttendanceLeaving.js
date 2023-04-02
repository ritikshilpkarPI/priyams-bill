const { DailyAttendance } = require('../db-models/staff-attendance');

const addDailyAttendanceLeaving = async (req, res,next) => {
  const { name, date } = req.body;

  try {
    let attendancecheck = await DailyAttendance.findOne({
      name: req.body.name,
      date: req.body.date,
    });
    if (attendancecheck && attendancecheck.attendance) {
      if (!attendancecheck.todaysLeave) {
        let totalHours =
          new Date(Date.now()) -
          new Date(attendancecheck.arrivingTime).getTime();

        let attendanceToBeUpdated = {
          arrivingTime: attendancecheck.arrivingTime,
          name: attendancecheck.name,
          leavingTime: new Date(),
          date: attendancecheck.date,
          totalHoursOfWork: totalHours, // Saving total hours in milliseconds
          workHoursCompleted: totalHours >= 40680000,
          todaysLeave: true,
        };

        try {
          const attendance = await DailyAttendance.findByIdAndUpdate(
            attendancecheck._id,
            attendanceToBeUpdated,
            {
              new: true,
              upsert: true,
            }
          );

          res.status(200).json({ message: attendance });
        } catch (error) {
          next(error)
        }
      } else {
        res
          .status(230)
          .json({ message: 'You have already put attendance for today' });
      }
    } else {
      res.status(230).json({ message: 'You need to add arriving Data first ' });
    }
  } catch (error) {
   next(error)
  }
};

module.exports = addDailyAttendanceLeaving;
