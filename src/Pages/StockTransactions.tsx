import React, { useEffect } from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import DataTable from './DataTable';
import { TransactionTableConstants } from 'src/constants/transactionTableConstants';
import {
  setIsLoading,
  setRawData,
  transformData,
  toggleExpandedRow,
  setPage,
  setRowsPerPage,
  setStartDate,
  setEndDate,
} from 'src/redux/stockTransactions/stockTransactionsSlice';
import { generateColor } from 'src/utils/constants/generateColor';
import { getStockTransactions } from 'src/utils/apiUtils';
import DateRangePicker from 'src/components/DateRangePicker';

const StockTransactions: React.FC = () => {
  const dispatch = useDispatch();
  const {
    rawData,
    transformedData: data,
    expandedRows,
    isLoading,
    page,
    rowsPerPage,
    startDate,
    endDate,
  } = useSelector((state: RootState) => state.stockTransactions);
  const storeData = useSelector((state: RootState) => state.user.storeData);

  const fetchTransactions = async () => {
    dispatch(setIsLoading(true));

    const currentPageData = rawData[page]; 
    
    if (currentPageData) {
      dispatch(transformData()); 
    } else {
      const result = await getStockTransactions({
        startDate,
        endDate,
        storeId: storeData._id,
        page,
        limit: 100,
      });

      if (!result?.isError) {
        dispatch(setRawData({ page, data: result.data }));
        dispatch(transformData());
      } else {
        console.error('Failed to fetch');
      }
    }

    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
  }, [startDate, endDate, page, rowsPerPage,expandedRows]);

  const handleStartDateChange = (newDate: Date | null) => {
    if (newDate) {
      dispatch(setStartDate(newDate));
      if (newDate > endDate) {
        dispatch(setEndDate(newDate));
      }
    }
  };

  const handleEndDateChange = (newDate: Date | null) => {
    if (newDate) dispatch(setEndDate(newDate));
  };

   const handlePageChange = (_: unknown, newPage: number) => {
      dispatch(setPage(newPage));
    };
  
    const handleRowsPerPageChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      dispatch(setRowsPerPage(parseInt(e.target.value.toString(), 10)));
    };

  const handleEditClick = (rowId: string) => {
    console.log(rowId);
  };

  const renderTransactionId = (row: any) => {
    if (row.isSubRow) return null;
    return (
      <Chip
        label={row.transactionId}
        size="small"
        sx={{
          backgroundColor: generateColor(row.transactionId),
          color: '#fff',
        }}
      />
    );
  };

  const renderEditButton = (row: any) => {
    if (row.isSubRow) return null;
    return (
      <Button
        variant="contained"
        size="small"
        color="primary"
        onClick={() => handleEditClick(row._id)}
      >
        Edit
      </Button>
    );
  };

  const columns = TransactionTableConstants.COLUMNS.map((col) => {
    switch (col.key) {
      case TransactionTableConstants.TRANSACTIONID:
        return { ...col, render: renderTransactionId };
      case TransactionTableConstants.EDIT:
        return { ...col, render: renderEditButton };
      default:
        return col;
    }
  });

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Stock Transactions
      </Typography>

      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
      />
      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowCount={data.length}
        expandedRows={expandedRows}
        onToggleExpand={(id) => {
          dispatch(toggleExpandedRow(id));
        }}/>
    </Box>
  );
};

export default StockTransactions;
