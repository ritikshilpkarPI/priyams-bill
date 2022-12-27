import React from "react";
import { Group, Title, Select, Button } from "@mantine/core";
import { useState } from "react";
import Axios from "axios";
import '../CSS/employeeAttendance.css'
const nameOptionAndValues = [
  { value: "anjali", label: "Anjali" },
  { value: "naveen", label: "Naveen" },
  { value: "shivam", label: "Shivam" },
  { value: "shahbaz", label: "Shahbaz" },
  { value: "mohit", label: "Mohit" },
];
const attendanceOptions = [
  { value: "arrival", label: "Arrival" },
  { value: "leave", label: "Leaving" },
];
const presentAbsentOptions = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
];

const EmployeeAttendance = () => {
  const [name, setName] = useState("");
  const [state, setState] = useState("arrival");
  const [attendance, setAttendance] = useState("present");

  const handleAttendance = async () => {
    // Checks if the staff has marks the attendance for arrival and stops him
    // for doing it again.
    
    const date = new Date();
    const dateString = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
   
    // const attendee = JSON.parse(localStorage.getItem(name));
 
   
    if (!name) {
      alert("Select the name for attendance");
      return;
    } else if (state === "arrival" && attendance === "absent") {
      alert("You cannot mark absent for arrival");
      return;
    } 
    else if (attendance === "absent") {
      try {
        await Axios.request({
          url: `/api/attendance/markAbsent`,
          method: "post",
          data: {
            name,
            date: dateString,
          },
        });
        alert(`You have successfully marked Absent  for ${name} `);
      } catch (error) {
        console.error(error);
      }
    } else if (state === "arrival") {
      try {
        const result = await Axios.request({
          url: `/api/attendance/dailyAttendanceArrival`,
          method: "post",
          data: {
            name,
            arrivingTime: date,
            date: dateString,
            attendance: attendance === "present" ? true : false,
          },
        });
        if (result.status === 200) {
          alert(
            `You have successfully marked the Arrival attendance for ${name} `
          );
        } else {
          alert(result.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    } else if (state === "leave") {
      try {
        
       let a = await Axios.request({
          url: `/api/attendance/dailyAttendanceLeaving`,
          method: "post",
          data: {
            name: name,
            date: dateString,
          },
        });
       
        if(a.status === 230){
          alert(a.data.message)
        } 
        else {
        alert(
          `You have successfully marked the Leaving attendance for ${name} `
        );
        }
      } catch (error) {
        console.error(error);
      }
    } 
    else {
      alert(`You need to add arriving Data first for ${name} `);
    }
    setName("");
  };
  return (
    <div className="attendance-container">
      <Title order={2}>Attendance</Title>
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
        <Button class="attendance-button" onClick={handleAttendance}>Submit</Button>
      </Group>
    </div>
  );
};
export default EmployeeAttendance;
