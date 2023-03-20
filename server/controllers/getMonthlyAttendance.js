const { DailyAttendance } = require('../db-models/staff-attendance');

const getMonthlyAttendance = async (req, res) => {
    try {
      const monthlyAttendance = await DailyAttendance.aggregate([
        // { $match: { date: { $lt: new Date("3,11,2022") } } },
        {
          $group: {
            // name: '$name',
            _id: '$name',
            workingDays: { $sum: { $cond: ['$attendance', 1, 0] } },
            workingHours: {
              $sum: { $cond: ['$attendance', '$totalHoursOfWork', 0] },
            },
            holidays: { $sum: { $cond: ['$attendance', 0, 1] } },
          },
        },
      ]);
      res.status(200).json({ message: monthlyAttendance });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = getMonthlyAttendance;
  