
import React from 'react';
import { Box } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className="date-picker-container" sx={{ display: 'flex', gap: 2 }}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={onStartDateChange}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          minDate={startDate ?? undefined} 
          onChange={onEndDateChange}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangePicker;
