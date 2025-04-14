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
} from 'src/redux/stockTransactions/stockTransactionsSlice';
import { generateColor } from 'src/utils/constants/generateColor';
import { getStockTransactions } from 'src/utils/apiUtils';

const StockTransactions: React.FC = () => {
  const dispatch = useDispatch();
  const {
    rawData,
    transformedData: data,
    expandedRows,
    isLoading,
    page,
    rowsPerPage,
  } = useSelector((state: RootState) => state.stockTransactions);

  const fetchTransactions = async () => {
    dispatch(setIsLoading(true));
    const result = await getStockTransactions();
    if (!result?.isError) {
      dispatch(setRawData(result.data));
      dispatch(transformData());
    } else {
      console.error('Failed to fetch');
    }
    dispatch(setIsLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    dispatch(transformData());
  }, [rawData, expandedRows]);

  const handlePageChange = (_: unknown, newPage: number) => dispatch(setPage(newPage));

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch(setRowsPerPage(parseInt(e.target.value, 10)));
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
      case 'edit':
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
        onToggleExpand={(id) => dispatch(toggleExpandedRow(id))}
      />
    </Box>
  );
};

export default StockTransactions;
