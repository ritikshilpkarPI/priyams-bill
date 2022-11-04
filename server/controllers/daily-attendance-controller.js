const { DailyAttendance } = require("../db-models/staff-attendance");

const addDailyAttendanceArrival = async (req, res) => {
  try {
    let checkInside = await DailyAttendance.find({
      name: req.body.name,
      date: req.body.date,
    });

    if (!checkInside.length) {
      let attendance = new DailyAttendance({
        name: req.body.name,
        arrivingTime: req.body.arrivingTime,
        date: req.body.date,
        attendance: req.body.attendance,
      });
      await attendance.save();
      res.status(200).json({ message: attendance });
    } else {
      res
        .status(230)
        .json({ message: "You have already put attendance for today" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const addDailyAttendanceLeaving = async (req, res) => {
  const { id, attendanceToBeUpdated } = req.body;
  try {
    // let attendance = await DailyAttendance.findByIdAndUpdate(id, attendanceToBeUpdated, {
    //     new: true
    // })
    const attendance = await DailyAttendance.findByIdAndUpdate(
      id,
      attendanceToBeUpdated,
      {
        new: true,
        upsert: true,
      }
    );
    res.status(200).json({ message: attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getDatesWiseAttendance = async (req, res) => {
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
    res.status(500).json({ error: error.message });
  }
};
const getMonthlyAttendance = async (req, res) => {
  try {
    const monthlyAttendance = await DailyAttendance.aggregate([
      // { $match: { date: { $lt: new Date("3,11,2022") } } },
      {
        $group: {
          // name: '$name',
          _id: "$name",
          workingDays: { $sum: { $cond: ["$attendance", 1, 0] } },
          workingHours: {
            $sum: { $cond: ["$attendance", "$totalHoursOfWork", 0] },
          },
          holidays: { $sum: { $cond: ["$attendance", 0, 1] } },
        },
      },
    ]);
    res.status(200).json({ message: monthlyAttendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const markAbsent = async (req, res) => {
  try {
    const result = new DailyAttendance({
      name: req.body.name,
      arrivingTime: "00",
      date: "2022-11-04T18:30:00.000Z",
      attendance: false,
      leavingTime: "00",
      totalHoursOfWork: 0,
      workHoursCompleted: false,
    });
    await result.save();
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addDailyAttendanceArrival,
  addDailyAttendanceLeaving,
  getDatesWiseAttendance,
  getMonthlyAttendance,
  markAbsent,
};
