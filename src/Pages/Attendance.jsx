import axios from "axios";
import { useEffect, useState } from "react";
import { Table, Loader } from '@mantine/core'
function msToTime(duration) {
    const seconds = duration / 1000;
    const hours = seconds / 3600
    return Math.floor(hours);
}
// function pad(number) {
//     var result = "" + number;
//     if (result.length < 2) {
//         result = "0" + result;
//     }

//     return result;
// }

// let minutesPerDay = 60 * 24;
// function millisToDaysHoursMinutes(millis) {
//     var seconds = millis / 1000;
//     var totalMinutes = seconds / 60;

//     var days = totalMinutes / minutesPerDay;
//     totalMinutes -= minutesPerDay * days;
//     var hours = totalMinutes / 60;
//     totalMinutes -= hours * 60;

//     return days > 1 ? days + "." + pad(hours) + "." + pad(totalMinutes) : 0;
// }
const Attendance = () => {
    const [attendance, setAttendance] = useState([])
    const [loader, setLoader] = useState(false);
    const getAttendance = async () => {
        const attendance = await axios.request({
            url: "/api/attendance/dailyAttendance",
            method: "post",
        })
        const monthlyattendance = await axios.request({
            url: "/api/attendance/monthlyAttendance",
            method: "get",
        })
        console.log({ attendance, monthlyattendance });
        setAttendance(monthlyattendance.data.message)
    }
    useEffect(() => {
        getAttendance()
        // monthlyattendance()
    }, [])
    const rows = attendance.map((element, index) => (
        <tr key={index}>
            <td>{index + 1}</td>
            <td>{element._id}</td>
            <td>{element.workingDays}</td>
            <td>{msToTime(element.workingHours)}</td>
            <td>{element.holidays}</td>
        </tr>
    ));

    return (
        <div>
            {
                loader ? <Loader color="blue" size="xl" /> :

                    <Table highlightOnHover withBorder withColumnBorders>
                        <thead>
                            <tr>
                                <th>SR NO</th>
                                <th>Staff Name</th>
                                <th>Total Working Days</th>
                                <th>Total Working Hours </th>
                                <th>Holidays</th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </Table>
            }

        </div>
    )
}

export default Attendance;