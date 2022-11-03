import React from 'react';
import { Group, Title, Select, Button } from '@mantine/core';
import { useState } from 'react';
import Axios from 'axios';
const nameOptionAndValues = [
    { value: 'rajesh', label: 'Raju' },
    { value: 'anjali', label: 'Anjali' },
    { value: 'binod', label: 'Binod' },
    { value: 'vue', label: 'Vue' },
]
const attendanceOptions = [
    { value: 'arrival', label: "Arrival" },
    { value: 'leave', label: "Leaving" }
]
const presentAbsentOptions = [
    { value: 'present', label: "Present" },
    { value: 'absent', label: "Absent" }
]
const totalWorkHoursInMillis = 40680000
const EmployeeAttendance = () => {
    const [name, setName] = useState("");
    const [state, setState] = useState("arrival");
    const [attendance, setAttendance] = useState("present")

    const handleAttendance = async () => {
        // Checks if the staff has marks the attendance for arrival and stops him 
        // for doing it again.
        if (!name) {
            alert("Select the name for attendance")
            return;
        }
        const date = new Date();
        const timeString = date.toLocaleTimeString("en-US")
        const dateString = date.toLocaleDateString({ year: 'numeric', month: 'numeric', day: 'numeric' })
        const attendee = JSON.parse(localStorage.getItem(name));
        if (name === attendee?.name && state === "arrival") {
            alert(`You have already made attendance for ${name} Arrival `)
        }
        if (name !== attendee?.name && state === "arrival") {
            try {
                const result = await Axios.request({
                    url: `/api/attendance/dailyAttendanceArrival`,
                    method: "post",
                    data: {
                        name,
                        arrivingTime: timeString,
                        date: dateString,
                        attendance
                    }
                });
                localStorage.setItem(result.data.message.name, JSON.stringify(true));
                alert(`You have marked the Arrival attendance for ${name} `)
            } catch (error) {
                console.log(error)
            }

        }
        if (name === attendee?.name && state === "leave") {
            try {
                let totalHours = date.getTime() - new Date(attendee.arrivingTime).getTime();
                await Axios.request({
                    url: `/api/attendance/dailyAttendanceLeaving`,
                    method: "post",
                    data: {
                        id: attendee._id,
                        attendanceToBeUpdated: {
                            arrivingTime: attendee.arrivingTime,
                            name: attendee.name,
                            leavingTime: dateString,
                            date: attendee.date,
                            totalHoursOfWork: totalHours,// Saving total hours in milliseconds
                            workHoursCompleted: totalHours >= totalWorkHoursInMillis
                        }
                    }
                });
                alert(`You have marked the Leaving attendance for ${name} `)
            } catch (error) {
                console.log(error);
            }
        }
        setName("")
    };
    return (
        <div className='attendance-container'>
            <Title order={2} >Attendance</Title>
            <Group align="center" position="apart">
                <Select
                    label="Select your Name"
                    placeholder="Pick one"
                    data={nameOptionAndValues}
                    value={name}
                    onChange={(value) => setName(value)}
                />
                <Select
                    label="Select Arrival/Leaving"
                    placeholder="Pick one"
                    data={attendanceOptions}
                    onChange={(value) => setState(value)}
                    defaultValue={state}
                />
                <Select
                    label="Select Present/Absent"
                    placeholder="Pick one"
                    data={presentAbsentOptions}
                    onChange={(value) => setAttendance(value)}
                    defaultValue={attendance}
                />
                <Button onClick={handleAttendance}>Submit</Button>
            </Group>
        </div>
    )
}
export default EmployeeAttendance;