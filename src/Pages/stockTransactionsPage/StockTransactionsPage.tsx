import { Box, Typography, Tabs, Tab, TextField, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CONSTANTS } from '../../constants/constants';
import { getStockTransactionsByStatusApi } from 'src/utils/apiUtils';
import DataTable from '../DataTable';
import { Badge, Chip } from '@mantine/core';
import { generateColor } from 'src/utils/constants/generateColor';
import { formatShortDate } from 'src/utils/formatDate';

const tabStatuses = Object.entries(CONSTANTS.TRANSACTIONS_STATUS);
const tabLabels: Record<keyof typeof CONSTANTS.TRANSACTIONS_STATUS, string> = {
  SOURCE_CREATED: 'Source Created',
  DESTINATION_UPDATED: 'Destination Updated',
  APPROVED: 'Approved',
};

const StockTransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const status =
    searchParams.get('status') || CONSTANTS.TRANSACTIONS_STATUS.SOURCE_CREATED;

  useEffect(() => {
    if (!searchParams.get('status')) {
      setSearchParams({ status: CONSTANTS.TRANSACTIONS_STATUS.SOURCE_CREATED });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getStockTransactionsByStatusApi(
          status,
          page,
          rowsPerPage
        );
        setTransactions(response?.transactions || []);
        setRowCount(response?.total || 0);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [status, page, rowsPerPage]);

  const handleTabChange = (_: any, newValue: string) => {
    setSearchParams({ status: newValue });
    setPage(1); // reset pagination on tab change
  };

  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
  };

  const flattenedTransactions = transactions.map((txn: any) => ({
    ...txn,
    itemName: txn.transactionItems?.[0]?.itemId?.name ?? 'N/A',
    destinationName: txn.destination?.destinationEntityId?.name ?? 'N/A',
    destinationStaffName: txn.destination?.destinationStaff?.name ?? 'N/A',
    sourceName: txn.source?.sourceEntityId?.name ?? 'N/A',
    sourceStaffName: txn.source?.sourceStaff?.name ?? 'N/A',
    createdAt: formatShortDate(txn.createdAt),
  }));

  console.log('flattenedTransactions: ', flattenedTransactions);

  const columns = [
    {
      key: '_id',
      label: 'Transaction ID',
      minWidth: 250,
      render: (row: any) => {
        return (
          <Badge
            sx={{
              backgroundColor: generateColor(row._id),
              color: '#fff',
              cursor: 'default',
            }}
          >
            {row._id}
          </Badge>
        );
      },
    },
    { key: 'destinationName', label: 'Destination Name' },
    { key: 'destinationStaffName', label: 'Destination Staff' },
    { key: 'sourceName', label: 'Source Name' },
    { key: 'sourceStaffName', label: 'Source Staff' },
    { key: 'createdAt', label: 'Created At', sortable: true },
    {
      key: 'quantity',
      label: 'Quantity',
      render: (row: any) => row.transactionItems.length,
    },
    { key: 'approvedByAdmin', label: 'Approved',
      render: (row: any) => {
        return row.approvedByAdmin &&  <Chip defaultChecked color="green" variant="outline">YES</Chip>;
      }
    },
    {
      key: 'transactionStatus',
      label: 'Status',
      minWidth: 230,
      render: (row: any) => {
        const statusColorMap: Record<string, string> = {
          [CONSTANTS.TRANSACTIONS_STATUS.SOURCE_CREATED]: 'violet',
          [CONSTANTS.TRANSACTIONS_STATUS.DESTINATION_UPDATED]: 'orange',
          [CONSTANTS.TRANSACTIONS_STATUS.APPROVED]: 'green',
        };
        const color = statusColorMap[row.transactionStatus] || 'gray';
        return (
          <Badge color={color}>
            {tabLabels[row.transactionStatus as keyof typeof tabLabels] ||
              row.transactionStatus}
          </Badge>
        );
      },
    },
    {
      key: 'action',
      label: 'Action',
      render: (row: any) => (
        <Button
          onClick={() => navigate(`/createTransaction/${row._id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box p={3} flex={1}>
      <Typography variant="h4" gutterBottom>
        Stock Transactions
      </Typography>

      <Tabs
        value={status}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
      >
        {tabStatuses.map(([key, value]) => (
          <Tab
            key={key}
            label={tabLabels[key as keyof typeof tabLabels]}
            value={value}
            sx={{ flexShrink: 0 }}
          />
        ))}
      </Tabs>

      <DataTable
        columns={columns}
        data={flattenedTransactions}
        isLoading={isLoading}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowCount={rowCount}
        paginationMode="server"
        expandedRows={expandedRows}
      />
    </Box>
  );
};

export default StockTransactionsPage;
