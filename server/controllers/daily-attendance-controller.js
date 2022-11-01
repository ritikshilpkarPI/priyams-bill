const { DailyAttendance } = require("../db-models/staff-attendance");

const addDailyAttendanceArrival = async (req, res) => {
    try {
        let attendance = await new DailyAttendance({
            name: req.body.name,
            arrivingTime: req.body.arrivingTime
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

module.exports = { addDailyAttendanceArrival, addDailyAttendanceLeaving };
