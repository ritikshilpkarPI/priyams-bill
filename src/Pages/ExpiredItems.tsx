import React, { useState, useEffect } from 'react';
import { Typography, TextField, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ReusableTable from './ReusableTable';
import { formatShortDate } from '../utils/formatDate';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpiredItems } from '../utils/apiUtils';
import { AppDispatch } from 'src/redux/store';

const ExpiredItemTable: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );

  const dispatch = useDispatch<AppDispatch>();

  const items = useSelector((state: RootState) => state.expiredItems.items);
  const isLoading = useSelector(
    (state: RootState) => state.expiredItems.isLoading
  );

  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [orderBy, setOrderBy] = useState<string>('expiryDate');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  useEffect(() => {
    dispatch(fetchExpiredItems(startDate, endDate));
  }, [startDate, endDate, dispatch]);

  const handleStartDateChange = (newDate: Date | null) => {
    if (newDate) {
      setStartDate(newDate);
      if (newDate > endDate) {
        setEndDate(newDate);
      }
    }
  };

  const handleEndDateChange = (newDate: Date | null) => {
    if (newDate) {
      setEndDate(newDate);
    }
  };

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

      <ReusableTable
        columns={[
          { label: 'Item Name', key: 'itemName', sortable: true },
          { label: 'Barcode', key: 'itemBarcode', sortable: true },
          { label: 'MRP', key: 'itemMRPperUnit', sortable: true },
          { label: 'CP', key: 'itemCostPricePerUnit', sortable: true },
          { label: 'SP', key: 'itemSellingPricePerUnit', sortable: true },
          {
            label: 'Manufacturing Date',
            key: 'manufacturingDate',
            sortable: true,
            render: (row: ExpiredItem) =>
              row.mfgDate ? formatShortDate(row.mfgDate) : 'N/A',
          },
          {
            label: 'Expiry Date',
            key: 'expiryDate',
            sortable: true,
            render: (row: ExpiredItem) =>
              row.expiryDate ? formatShortDate(row.expiryDate) : 'N/A',
          },
          { label: 'Expiry Qty', key: 'expiryQuantity', sortable: true },
        ]}
        data={items.map((item: ExpiredItem) => ({
          ...item,
          manufacturingDate: formatShortDate(item.mfgDate),
          expiryDate: formatShortDate(item.expiryDate),
        }))}
        isLoading={isLoading}
        order={order}
        orderBy={orderBy}
        onSort={(columnKey: string) => {
          const isAsc = orderBy === columnKey && order === 'asc';
          setOrder(isAsc ? 'desc' : 'asc');
          setOrderBy(columnKey);
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) =>
          setRowsPerPage(parseInt(e.target.value.toString(), 10))
        }
        rowCount={items.length}
      />
    </Box>
  );
};

export default ExpiredItemTable;
