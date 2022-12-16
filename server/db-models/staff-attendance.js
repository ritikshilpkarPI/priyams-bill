const mongoose = require("mongoose");

const StaffAttendanceSchema = new mongoose.Schema(
    {
        name: { type: String },
        arrivingTime: { type: String },
        leavingTime: { type: String },
        date: { type: Date },
        totalHoursOfWork: { type: Number },
        workHoursCompleted: { type: Boolean },
        attendance: { type: Boolean },
        todaysLeave: { type: Boolean }
    }
);

const DailyAttendance = mongoose.model("Attendance", StaffAttendanceSchema);

module.exports = { DailyAttendance };
