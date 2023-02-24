const cron = require('node-cron');
const { DailyAttendance } = require('./db-models/staff-attendance');

//   runs every day at 11:00 pm

cron.schedule('00 23 * * *', async () => {
  // 00 23 * * *       - 11:00 pm

  //   targeting who not put leave and  put arrivinig attendance
  try {
    let checkInside = await DailyAttendance.find({
      todaysLeave: false,
    });

    //   putting leave for those who not put leave

    checkInside.forEach(async (element) => {
      let totalHours =
        new Date(Date.now()) - new Date(element.arrivingTime).getTime();
      let ArrivedTime = new Date(element.arrivingTime).getTime();
      let leaveTime = ArrivedTime + 4 * 60 * 60 * 1000;
      let attendanceToBeUpdated = {
        arrivingTime: element.arrivingTime,
        name: element.name,
        leavingTime: new Date(leaveTime),
        date: element.date,
        totalHoursOfWork: totalHours, // Saving total hours in milliseconds
        workHoursCompleted: totalHours >= 40680000,
        todaysLeave: true,
      };
      try {
        const attendance = await DailyAttendance.findByIdAndUpdate(
          element._id,
          attendanceToBeUpdated,
          {
            new: true,
            upsert: true,
          }
        );
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
});
