const { DailyAttendance } = require('../db-models/staff-attendance');

const getDatesWiseAttendance = async (req, res,next) => {
    const { startDate, endDate, name } = req.body;
    try {
      const allAttendance = await DailyAttendance.aggregate([
        {
          $match: {
            date: {
              $gt: new Date(new Date(startDate).setHours(0, 0, 0)),
              $lt: new Date(new Date(endDate).setHours(23, 59, 59)),
            },
            name,
          },
        },
        {
          $sort: {
            date: 1,
          },
        },
      ]);
      res.status(200).json({ message: allAttendance });
    } catch (error) {
      next(error)
    }
  };

  module.exports = getDatesWiseAttendance;