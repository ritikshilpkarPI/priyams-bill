import React from 'react';

const MyDatePicker = ({ setDate, date }) => {
  const handleDateChange = (event) => {
    let s = String(new Date(event.target.value).toLocaleDateString('en-US'));
    setDate(s);
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
        Expiry Date:
      </label>
      <input
        type="date"
        className="useby-date-picker"
        placeholder="Pick date"
        value={date}
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
