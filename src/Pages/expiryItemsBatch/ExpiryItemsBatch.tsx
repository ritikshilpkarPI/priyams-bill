import React, { useEffect, useState } from 'react';
import DataTable from '../DataTable';
import { Box, Button, Drawer, LoadingOverlay, Modal } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  getAllExpiryItemsBatchAPI,
  getExpiryItemsBatchByIdAPI,
} from 'src/utils/apiUtils';
import { setExpiredItemsBatch } from 'src/redux/expiredItemsBatch/ExpiredItemsBatchSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';

const ExpiryItemsBatch = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const expiryItemsBatchId = params?.id;
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [expandedStatusId, setExpandedStatusId] = useState<string | null>(null);

  const expiredItemsBatch = useSelector(
    (state: RootState) => state.expiredItemsBatch
  );

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const newPage = expiredItemsBatch?.pagination?.page;
    const newLimit = expiredItemsBatch?.pagination?.limit;

    if (newPage !== undefined && newLimit !== undefined) {
      setPagination({
        page: newPage,
        pageSize: newLimit,
      });
    }
  }, [
    expiredItemsBatch?.pagination?.page,
    expiredItemsBatch?.pagination?.limit,
  ]);

  const [loader, setLoader] = useState(false);

  const fetchGetExpiryItemsBatchByIdAPI = async () => {
    try {
      if (!expiryItemsBatchId) return;
      setLoader(true);
      const response = await getExpiryItemsBatchByIdAPI(expiryItemsBatchId);

      if (response.success) {
        dispatch(
          setExpiredItemsBatch({
            data: [response.data],
            pagination: {
              page: 1,
              limit: 10,
              totalPages: 0,
              total: 0,
            },
          })
        );
      }
    } catch (error) {
      toast.error('Unable to get Expired Items Batch, please try again');
    } finally {
      setLoader(false);
    }
  };

  const fetchGetAllExpiryItemsBatchAPI = async (page?: number) => {
    try {
      setLoader(true);
      const response = await getAllExpiryItemsBatchAPI({ page: page });
      console.log(response);

      if (response.success) {
        dispatch(
          setExpiredItemsBatch({
            data: response.data,
            pagination: {
              page: response.pagination.page || 0,
              limit: response.pagination.limit || 10,
              totalPages: response.pagination.totalPages || 0,
              total: response.pagination.total || 0,
            },
          })
        );
      }
    } catch (error) {
      toast.error('Unable to get Expired Items Batch, please try again');
    } finally {
      setLoader(false);
    }
  };

  const handlePageChange = (_: any, page: number) => {
    if (page >= 0) {
      const callBack = (prev: any) => ({ ...prev, page });
      pagination ? setPagination(callBack) : setPagination(callBack);
      fetchGetAllExpiryItemsBatchAPI(page);
    }
  };

  const handleRowsPerPageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: parseInt(e.target.value, 10),
    }));
  };

  useEffect(() => {
    if (expiryItemsBatchId) {
      fetchGetExpiryItemsBatchByIdAPI();
    } else {
      fetchGetAllExpiryItemsBatchAPI();
    }
  }, []);

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
          Edit Expiry Batch
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
        >
          Add Clearance
        </Button>
      ),
    },


  ];
  
  const rows = expiredItemsBatch.data.map((batch) => ({
    ...batch,
    dealerName: batch.dealerId?.dealerName ?? '',
    items: batch.items?.map((item) => {
      const matchedCost = batch.itemWiseTotalCost.find(
        (itemWise) => itemWise.itemId?._id === item.itemId?._id
      );
      
      return {
        ...item,
        itemTotalCost: matchedCost?.itemTotalCost ?? 0, 
        sku: item.itemId?.sku ?? ''
      };
    }) ?? [],
  }));

  const selectedRow = rows.find(
    (row) => row._id === expandedRowId
  );
  const selectedStatusRow = rows.find(
    (row) => row._id === expandedStatusId
  );

  const [firstOpened, firstHandlers] = useDisclosure(false);
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  
  return (
    <Box>
      <LoadingOverlay visible={loader} zIndex={1} />
      <DataTable
        columns={columns}
        data={rows}
        isLoading={false}
        page={pagination.page}
        rowsPerPage={pagination.pageSize}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        paginationMode="server"
        rowCount={expiredItemsBatch.pagination.total}
        order="asc"
        orderBy=""
        onSort={() => {}}
      />

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
              { key: 'sku', label: 'SKU'},
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
            page={0}
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
            page={0}
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