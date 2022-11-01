const { DailyAttendance } = require("../db-models/staff-attendance");

const addDailyAttendanceArrival = async (req, res) => {
    try {
        let attendance = await new DailyAttendance({
            name: req.body.name,
            arrivingTime: req.body.arrivingTime,
            date: req.body.date
        })
        res.status(200).json({ message: attendance })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const addDailyAttendanceLeaving = async (req, res) => {
    const { id, attendanceToBeUpdated } = req.body
    try {
        // let attendance = await DailyAttendance.findByIdAndUpdate(id, attendanceToBeUpdated, {
        //     new: true
        // })
        const attendance = await DailyAttendance.findByIdAndUpdate(
            id,
            attendanceToBeUpdated,
            {
                new: true,
                upsert: true
            }
        )
        res.status(200).json({ message: attendance })

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const getDatesWiseAttendance = async (req, res) => {
    console.log({ body: req.body });
    console.log({ date1: new Date(req.body.startDate), date2: new Date(req.body.endDate) });
    try {
        const allAttendance = await DailyAttendance.find({})
        console.log({ allAttendance });
        res.status(200).json({ message: allAttendance })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { addDailyAttendanceArrival, addDailyAttendanceLeaving, getDatesWiseAttendance };
