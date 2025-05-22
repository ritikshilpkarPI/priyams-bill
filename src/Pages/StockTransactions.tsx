import React, { useEffect} from 'react';
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
  clearRawData,
  setTotalCount
} from 'src/redux/stockTransactions/stockTransactionsSlice';
import { generateColor } from 'src/utils/constants/generateColor';
import { getItemTransactions, getStockTransactions } from 'src/utils/apiUtils';
import DateRangePicker from 'src/components/DateRangePicker';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router';

const StockTransactions: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    rawData,
    transformedData: data,
    expandedRows,
    isLoading,
    page,
    rowsPerPage,
    startDate,
    endDate,
    totalCount,
  } = useSelector((state: RootState) => state.stockTransactions);

  const storeData = useSelector((state: RootState) => state.user.storeData);
  const selectedItemsIds = useSelector(
    (state: RootState) => state.storeInventoryManagement.selectedItemsIds
  );
  const isDirectedfromStoreInventory = location.state?.fromStoreInventory;

  const navigate = useNavigate();
  
  const fetchTransactions = async (targetPage: number, limit: number) => {
    dispatch(setIsLoading(true));
  
    let result;
    if(isDirectedfromStoreInventory) {
      const storeIds = storeData._id ? [storeData._id] : [];
      result = await getItemTransactions({
        storeIds,
        page: page,
        limit: rowsPerPage,
        itemIds: selectedItemsIds
      });
    } else {
      result = await getStockTransactions({
        startDate,
        endDate,
        storeId: storeData._id,
        page: targetPage, 
        limit,
      });
    }
  
    if (!result?.isError) {
      dispatch(setRawData({ page: `${targetPage}_${limit}`, data: result.data }));
      dispatch(setTotalCount(result.totalCount));
      dispatch(transformData());
    } else {
      console.error('Failed to fetch');
    }
  
    dispatch(setIsLoading(false));
  };
  
  useEffect(() => {
    return () => {
      dispatch(clearRawData());
    }
  }, []);
  
  useEffect(() => {
   
    const currentPageData = rawData[`${page}_${rowsPerPage}`];
    if (currentPageData?.length) {
      dispatch(transformData());
    } else {
      fetchTransactions(page, rowsPerPage);
    }
  }, [startDate, endDate, page, rowsPerPage,expandedRows, selectedItemsIds]);
  


  const seenTxnIds = new Set();
  let duplicateTxnCount = 0;
  let expandedSubRows = 0;

  data.forEach((row) => {
  if (row.isSubRow) {
    expandedSubRows += 1;
    return;
  }

  const txnId = row.transactionId;

  if (seenTxnIds.has(txnId)) {
    duplicateTxnCount += 1;
  } else {
    seenTxnIds.add(txnId);
  }
  });

  const totalRowsToShow = totalCount + duplicateTxnCount + expandedSubRows;

  const handleStartDateChange = (newDate: Date | null) => {
    if (newDate) {
      dispatch(clearRawData());
      dispatch(setStartDate(newDate));
      if (newDate > endDate) {
        dispatch(setEndDate(newDate));
      }
    }
  };

  const handleEndDateChange = (newDate: Date | null) => {
    if (newDate) {
      dispatch(clearRawData());
      dispatch(setEndDate(newDate));
    }
  };

  const handlePageChange = (_: unknown, newPage: number) => {
  
      dispatch(setPage(newPage));
  };
  

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newRowsPerPage = parseInt(e.target.value.toString(), 10);
    
    dispatch(setRowsPerPage(newRowsPerPage));
  };

  const handleEditClick = (rowId: string) => {
    const transactionId =  rowId.split('_')[0];
    navigate(`/create-transaction/${transactionId}`);
  };

  const renderTransactionId = (row: { transactionId: string; isSubRow?: boolean }) => {
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

  const renderEditButton = (row: { _id: string; isSubRow?: boolean }) => {
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

      {!isDirectedfromStoreInventory && 
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
      />
      }
      <DataTable
        key={`grid-${page}-${rowsPerPage}-${totalRowsToShow}`} 
        columns={columns}
        data={data}
        isLoading={isLoading}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowCount={totalRowsToShow}
        expandedRows={expandedRows}
        onToggleExpand={(id) => {
          dispatch(toggleExpandedRow(id));
        }}
      />
    </Box>
  );
};

export default StockTransactions;
