import React from 'react';
import { Group, Title, Select, Button } from '@mantine/core';
import { useState } from 'react';
import Axios from 'axios';
const nameOptionAndValues = [
    { value: 'anjali', label: 'Anjali' },
    { value: 'abhishek', label: 'Abhishek' },
    { value: 'rajesh', label: 'Rajesh' },
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
        const date = new Date();
        const dateString = date.toLocaleDateString("en-US", { year: 'numeric', month: 'numeric', day: 'numeric' })
        const attendee = JSON.parse(localStorage.getItem(name));
        if (!name) {
            alert("Select the name for attendance")
            return;
        } else if (name === attendee?.name && state === "arrival") {
            alert(`You have already made attendance for ${name} Arrival `)
        } else if (state === "absent") {
            try {
                await Axios.request({
                    url: `/api/attendance/markAbsent`,
                    method: "post",
                    data: {
                        name,
                        date: dateString,
                    }
                });
                alert(`You have successfully marked Absent  for ${name} `)
            } catch (error) {
                console.log(error)
            }
        } else if (name !== attendee?.name && state === "arrival") {
            try {
                const result = await Axios.request({
                    url: `/api/attendance/dailyAttendanceArrival`,
                    method: "post",
                    data: {
                        name,
                        arrivingTime: date,
                        date: dateString,
                        attendance: attendance === "present" ? true : false
                    }
                });
                if (result.status === 200) {
                    localStorage.setItem(result.data.message.name, JSON.stringify(result.data.message));
                    alert(`You have successfully marked the Arrival attendance for ${name} `)
                } else {
                    alert(result.data.message)
                }
            } catch (error) {
                console.log(error)
            }
        } else if (name === attendee?.name && state === "leave") {
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
                            leavingTime: date,
                            date: attendee.date,
                            totalHoursOfWork: totalHours,// Saving total hours in milliseconds
                            workHoursCompleted: totalHours >= totalWorkHoursInMillis
                        }
                    }
                });
                alert(`You have successfully marked the Leaving attendance for ${name} `)
            } catch (error) {
                console.log(error);
            }
        } else {
            alert(`You need to add arriving Data first for ${name} `)
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