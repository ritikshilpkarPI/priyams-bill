import React, { useEffect } from 'react';
import { Typography, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { formatShortDate } from '../utils/formatDate';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpiredItems } from '../utils/apiUtils';
import { AppDispatch } from 'src/redux/store';
import {
  setStartDate,
  setEndDate,
  setOrder,
  setOrderBy,
  setPage,
  setRowsPerPage,
} from 'src/redux/expiredItems/expiredItemsSlice';
import DataTable from './DataTable';
import { ExpiredItemTableConstants } from 'src/utils/constants/expiredItemTableConstants';

const ExpiredItemTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    items,
    isLoading,
    startDate,
    endDate,
    order,
    orderBy,
    page,
    rowsPerPage,
  } = useSelector((state: RootState) => state.expiredItems);

  useEffect(() => {
    dispatch(fetchExpiredItems(startDate, endDate));
  }, [startDate, endDate, dispatch]);

  const handleStartDateChange = (newDate: Date | null) => {
    if (newDate) {
      dispatch(setStartDate(newDate));
      if (newDate > endDate) {
        dispatch(setEndDate(newDate));
      }
    }
  };

  const handleEndDateChange = (newDate: Date | null) => {
    if (newDate) {
      dispatch(setEndDate(newDate));
    }
  };

  const handleSort = (columnKey: string) => {
    const isAsc = orderBy === columnKey && order === 'asc';
    dispatch(setOrder(isAsc ? 'desc' : 'asc'));
    dispatch(setOrderBy(columnKey));
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleRowsPerPageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(setRowsPerPage(parseInt(e.target.value.toString(), 10)));
  };
  const columns = ExpiredItemTableConstants.COLUMNS.map((col) => {
    if (col.key === ExpiredItemTableConstants.MANUFACTURING_DATE) {
      return {
        ...col,
        render: (row: ExpiredItem) =>
          row.mfgDate ? formatShortDate(row.mfgDate) : 'N/A',
      };
    }
    if (col.key === ExpiredItemTableConstants.EXPIRY_DATE) {
      return {
        ...col,
        render: (row: ExpiredItem) =>
          row.expiryDate ? formatShortDate(row.expiryDate) : 'N/A',
      };
    }
    return col;
  });
  return (
    <Box className="expired-items-card">
      <Typography variant="h6">Expired Items</Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="date-picker-container">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            slotProps={{
              textField: {
                className: 'date-picker-field',
              },
            }}
          />

          <DatePicker
            label="End Date"
            value={endDate}
            minDate={startDate}
            onChange={handleEndDateChange}
            slotProps={{
              textField: {
                className: 'date-picker-field',
              },
            }}
          />
        </div>
      </LocalizationProvider>

      <DataTable
        columns={columns}
        data={items.map((item: ExpiredItem) => ({
          ...item,
          manufacturingDate: formatShortDate(item.mfgDate),
          expiryDate: formatShortDate(item.expiryDate),
        }))}
        isLoading={isLoading}
        order={order}
        orderBy={orderBy}
        onSort={handleSort}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowCount={items.length}
      />
    </Box>
  );
};

export default ExpiredItemTable;
