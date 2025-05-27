import React, { useEffect, useState } from 'react';
import DataTable from '../DataTable';
import { Button, Drawer, Grid } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  getAllExpiryItemsBatchAPI,
  getExpiryItemsBatchByIdAPI,
} from 'src/utils/apiUtils';
import { setExpiredItemsBatch, setPage, setLimit, setLoading, setTotal } from 'src/redux/expiredItemsBatch/ExpiredItemsBatchSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { Tabs, Tab, Typography, Box } from '@mui/material';
import { ITEM_EXPIRY_BATCH_STATUS } from 'src/constants/constants';

const STATUS_TABS = [ITEM_EXPIRY_BATCH_STATUS.SAVED, ITEM_EXPIRY_BATCH_STATUS.DRAFTED, ITEM_EXPIRY_BATCH_STATUS.APPROVED, ITEM_EXPIRY_BATCH_STATUS.CLEARED];
const ExpiryItemsBatch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') || 'SAVED';
  const expiryItemsBatchId = params?.id;
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [expandedStatusId, setExpandedStatusId] = useState<string | null>(null);
  const [firstOpened, firstHandlers] = useDisclosure(false);

  const { data, pagination, loading } = useSelector(
    (state: RootState) => state.expiredItemsBatch
  );
  const { page, limit, totalPages, total } = pagination;
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const handleTabChange = (_: any, newValue: string) => {
    setSearchParams({ status: newValue });
  };

  const handlePageChange = (_: any, newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(setLimit(parseInt(event.target.value, 10)));
  };


  const fetchGetExpiryItemsBatchByIdAPI = async () => {
    try {
      if (!expiryItemsBatchId) return;
      dispatch(setLoading(true));
      const response = await getExpiryItemsBatchByIdAPI(expiryItemsBatchId);

      if (response.success) {
        dispatch(
          setExpiredItemsBatch({
            data: [response.data],
          })
        );
      }
    } catch (error) {
      toast.error('Unable to get Expired Items Batch, please try again');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchGetAllExpiryItemsBatchAPI = async () => {
    try {
      dispatch(setLoading(true));
      const response = await getAllExpiryItemsBatchAPI({
        page: page,
        limit: limit,
        status: status,
      });
      if (response.success) {
        dispatch(
          setExpiredItemsBatch({
            data: response.data,
          })
        );
        dispatch(setTotal(response.pagination.total))
      }
    } catch (error) {
      toast.error('Unable to get Expired Items Batch, please try again');
    } finally {
      dispatch(setLoading(false));
    }
  };


  const rows = data.map((batch) => ({
    ...batch,
    dealerName: batch.dealerId?.dealerName ?? '',
    items:
      batch.items?.map((item) => {
        const matchedCost = batch.itemWiseTotalCost.find(
          (itemWise) => itemWise.itemId?._id === item.itemId?._id
        );

        return {
          ...item,
          itemTotalCost: matchedCost?.itemTotalCost ?? 0,
          sku: item.itemId?.sku ?? '',
        };
      }) ?? [],
  }));

  const selectedRow = data.find((row) => row._id === expandedRowId);
  const selectedStatusRow = data.find((row) => row._id === expandedStatusId);

  useEffect(() => {
    if (expiryItemsBatchId) {
      fetchGetExpiryItemsBatchByIdAPI();
    } else {
      fetchGetAllExpiryItemsBatchAPI();
    }
  }, [expiryItemsBatchId, page, limit, status]);

  useEffect(() => {
    if (!searchParams.has('status')) {
      setSearchParams({ status: 'SAVED' });
    }
  }, [searchParams, setSearchParams]);

  const columns = [
    { key: 'boxId', label: 'Box ID' },
    { key: 'dealerName', label: 'Dealer Name' },
    {
      key: 'expiryBatchCost',
      label: 'Batch Cost',
      render: (row: any) => `₹ ${row.expiryBatchCost.toFixed(2)}`,
    },
    { key: 'status', label: 'Status' },
    {
      key: 'isCleared',
      label: 'Cleared',
      render: (row: any) => (row.isCleared ? 'Yes' : 'No'),
    },
    { key: 'stockTransactionId', label: 'Stock TransactionId ID' },
    {
      key: 'statusHistory',
      label: 'Status History',
      render: (row: any) => (
        <Button
          onClick={() => {
            setExpandedStatusId(row._id === expandedStatusId ? null : row._id);
            firstHandlers.open();
          }}
        >
          {row._id === expandedStatusId ? 'Hide' : 'Show'}
        </Button>
      ),
    },
    
    {
      key: 'items',
      label: 'Items',
      render: (row: any) => (
        <Button
          onClick={() => {
            setExpandedRowId(row._id === expandedRowId ? null : row._id);
            firstHandlers.open();
          }}
        >
          {row._id === expandedRowId ? 'Hide' : 'Show'}
        </Button>
      ),
    },
    {
      key: 'edit',
      label: 'Action',
      render: (row: any) => (
        <Button
          size="xs"
          variant="outline"
          onClick={() => 
            navigate(`/addExpiredItem/${row._id}`)
          }
        >
          Edit Batch
        </Button>
      ),
    },
    {
      key: 'addClearance',
      label: 'Action',
      render: (row: any) => (
        <Button
          size="xs"
          variant="outline"
          onClick={() => 
            window.open(
              `/expiry-items-batch/${row._id}/add-clearance`,
              '_blank',
              'noopener,noreferrer'
            )
          }
          disabled={row.status !== 'APPROVED'}
        >
          Add Clearance
        </Button>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Grid>
        <Grid.Col span={12}>
          <Typography variant="h5" gutterBottom>
            Expiry Batches
          </Typography>
        </Grid.Col>
        <Grid.Col span={12}>
          <Tabs
            value={status}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
          >
            {STATUS_TABS.map((s) => (
              <Tab key={s} label={s} value={s} />
            ))}
          </Tabs>
        </Grid.Col>
        <Grid.Col span={12}>
          <DataTable
            columns={columns}
            data={rows}
            isLoading={loading}
            page={page}
            rowsPerPage={limit}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            paginationMode="server"
            rowCount={total}
            order="asc"
            orderBy=""
            onSort={() => {}}
          />
        </Grid.Col>
      </Grid>
      <Drawer
        size={'70%'}
        position={isSmallScreen ? 'top' : 'right'}
        opened={firstOpened}
        onClose={() => {
          firstHandlers.close();
          setExpandedRowId(null);
          setExpandedStatusId(null);
        }}
      >
        {selectedRow && (
          <DataTable
            columns={[
              { key: 'sku', label: 'SKU' , render: (row: any) => row.itemId?.sku ?? ''},
              { key: 'expiryDate', label: 'Expiry Date' },
              { key: 'quantity', label: 'Quantity' },
              {
                key: 'costPricePerUnit',
                label: 'Cost/Unit'

              },
              { key: 'totalCostPrice', label: 'Total Expiry Cost' },
              { key: 'itemTotalCost', label: 'Total Cost' },
            ]}
            data={selectedRow.items}
            isLoading={false}
            page={1}
            rowsPerPage={selectedRow.items.length}
            onPageChange={() => {}}
            onRowsPerPageChange={() => {}}
            rowCount={selectedRow.items.length}
            paginationMode="client"
            order="asc"
            orderBy=""
            onSort={() => {}}
          />
        )}

        {selectedStatusRow && (
          <DataTable
            columns={[
              { key: 'status', label: 'Status' },
              { key: 'staffId', label: 'Staff ID', render: (row) => row.staffId?.name ?? '–',
              },
              { key: 'dateTime', label: 'Date Time' },
              { key: 'browser', label: 'Browser' },
              { key: 'os', label: 'OS' },
              { key: 'ipReferrer', label: 'IP Referrer' },
              { key: 'statusChangeRemark', label: 'Remark' },
            ]}
            data={selectedStatusRow.statusHistory}
            isLoading={false}
            page={1}
            rowsPerPage={selectedStatusRow.statusHistory.length}
            onPageChange={() => {}}
            onRowsPerPageChange={() => {}}
            rowCount={selectedStatusRow.statusHistory.length}
            paginationMode="client"
            order="asc"
            orderBy=""
            onSort={() => {}}
          />
        )}
      </Drawer>
    </Box>
  );
};

export default ExpiryItemsBatch;
