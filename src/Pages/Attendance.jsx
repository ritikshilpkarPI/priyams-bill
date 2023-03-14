import { useEffect, useState } from 'react';
import { Table, Loader, Title } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import { Axios } from 'src/utils/axios';

function msToTime(duration) {
  const seconds = duration / 1000;
  const hours = seconds / 3600;
  return Math.floor(hours);
}

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [dateWiseAttendance, setDateWiseAttendance] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loader2, setLoader2] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setname] = useState('');
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const region = 'en-US';
  const [value, setValue] = useState([new Date(), new Date()]);
  const getAttendance = async () => {
    setLoader(true);
    try {
      const monthlyattendance = await Axios.request({
        url: '/api/attendance/monthlyAttendance',
        method: 'get',
      });
      setAttendance(monthlyattendance.data.message);
      setLoader(false);
    } catch (error) {
      console.error(error);
    }
  };
  const getDateWiseAttendance = async (name) => {
    setname(name);
    setLoader2(true);
    try {
      const result = await Axios.request({
        url: `/api/attendance/dailyAttendance`,
        method: 'post',
        data: {
          startDate: value[0].toLocaleDateString(region, options),
          endDate: value[1].toLocaleDateString(region, options),
          name,
        },
      });
      setDateWiseAttendance(result.data.message);
    } catch (error) {
      console.error(error);
    }
    setLoader2(false);
  };
  useEffect(() => {
    getAttendance();
  }, []);
  const rows2 = dateWiseAttendance.map((element, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>
        {new Date(element.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        })}
      </td>
      <td>{element.attendance ? 'Present' : 'Absent'}</td>
      <td>{new Date(element.arrivingTime).toLocaleTimeString()}</td>
      <td>
        {element.leavingTime
          ? new Date(element.leavingTime).toLocaleTimeString()
          : 'No Data'}
      </td>
      <td>
        {element.totalHoursOfWork
          ? msToTime(element.totalHoursOfWork)
          : 'No Data'}
      </td>
      <td>{element.workHoursCompleted ? 'Completed' : 'Not Completed'}</td>
    </tr>
  ));
  const rows = attendance.map((element, index) => (
    <tr
      key={index}
      onClick={() => {
        getDateWiseAttendance(element._id);
        setOpen(!open);
      }}
    >
      <td>{index + 1}</td>
      <td>{element._id}</td>
      <td>{element.workingDays}</td>
      <td>{msToTime(element.workingHours)}</td>
      <td>{element.holidays}</td>
    </tr>
  ));
  return (
    <tr className="attendance-wrapper">
      <DateRangePicker
        label="Select Date"
        placeholder="Pick dates range"
        value={value}
        onChange={setValue}
        className="date-picker"
      />
      {loader ? (
        <Loader color="blue" size="lg" />
      ) : (
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
      )}
      {loader2 ? <Title order={3}>Data is fetching for {name}</Title> : ''}
      {loader2 ? (
        <Loader color="blue" size="lg" />
      ) : !dateWiseAttendance.length ? (
        <>
          <Title className="table-title" order={2}>
            No Data is present for {name} on this Date
          </Title>
          <p>Try to choose different dates</p>
        </>
      ) : (
        <>
          <Title className="table-title" order={3}>
            Viewing Attendance for {name}{' '}
          </Title>
          <Table
            className="attendance-table"
            highlightOnHover
            withBorder
            withColumnBorders
          >
            <thead>
              <tr>
                <th>SR NO</th>
                <th>Date</th>
                <th>Present/Absent</th>
                <th>In Time</th>
                <th>Out Time</th>
                <th>Total Working Hours</th>
                <th>Work Completed</th>
              </tr>
            </thead>
            <tbody>{rows2}</tbody>
          </Table>
        </>
      )}
    </tr>
  );
};

export default Attendance;
