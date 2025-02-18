import React from 'react';

const MyDatePicker = ({ setDate, label }) => {

 const [selectedDate, setSelectedDate] = React.useState(new Date());
  const handleDateChange = (event) => {
    let s = String(new Date(event.target.value).toLocaleDateString('en-US'));
    setDate(s);
    setSelectedDate(event.target.value);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <label
        htmlFor="useby-date-picker"
        style={{
          fontSize: '14px',
          margin: '5px 0',
          width: '40px',
        }}
      >
        {label}
      </label>
      <input
        type="date"
        className="useby-date-picker"
        placeholder="Pick date"
        value={selectedDate}
        onChange={handleDateChange}
        style={{
          width: '100px',
          height: '40px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          fontSize: '16px',
          padding: '5px',
          margin: '5px 0',
          color: '#555',
        }}
      />
    </div>
  );
};

export default MyDatePicker;
