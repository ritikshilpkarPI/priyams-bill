import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import { itemPurchaseBatches } from '../utils/apiUtils';
import DataTable from './DataTable';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import {
  setIsLoading,
  setPage,
  setRowCount,
  setRowsPerPage,
  putPageInCache,
  showRows,
  setSelectedItem,
} from 'src/redux/inventoryPage/inventorySlice';
import { useSelector } from 'react-redux';

const NewInventoryPage: React.FC = () => {
  const dispatch = useDispatch();
  const { cache, items, page, rowsPerPage, rowCount, isLoading } = useSelector(
    (state: RootState) => state.inventory
  );

  const fetchItemPurchaseBatchesApi = async () => {
    const response = await itemPurchaseBatches({
      page: page + 1,
      limit: rowsPerPage,
    });
    if (response?.success) {
      dispatch(showRows(response.data));
      dispatch(setRowCount(response.totalCount));
    }
  };

  const navigate = useNavigate();
  const cacheKey = `${rowsPerPage}-${page}`;


  useEffect(() => {
    fetchItemPurchaseBatchesApi();
  }, [page, rowsPerPage, cacheKey, cache, dispatch]);

  const handlePageChange = (_: unknown, newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleRowsPerPageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(setRowsPerPage(parseInt(e.target.value.toString(), 10)));
  };

  function twoDigit(n?: number | null): string {
    const num = typeof n === 'number' && n >= 0 ? n : 0;
    return num.toString().padStart(2, '0');
  }

  const columns = [
    {
      key: 'sku',
      label: 'Item Sku',
    },
    {
      key: 'itemBarcode',
      label: 'Barcode',
    },
    {
      key: 'itemBrandName',
      label: 'Brand',
    },
    {
      key: 'itemCategory',
      label: 'Category',
    },
    {
      key: 'itemMRPperUnit',
      label: 'MRP',
    },
    {
      key: 'itemPerUnitQuantity',
      label: 'Quantity/Unit',
    },
    {
      key: 'quantityUnitName',
      label: 'Unit',
    },
    {
      key: 'companyName',
      label: 'Company',
    },
    {
      key: 'purchaseData',
      label: 'Purchase Data',
      render: (row: any) => (
        <button
          onClick={() => {
            dispatch(setSelectedItem(row));
            navigate(`/item-purchase-orders/${row._id}`);
          }}
          style={{
            padding: '4px 8px',
            backgroundColor: '#2e7d32',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Show POs - {twoDigit(row?.purchaseData?.length)}
        </button>
      ),
    },
  ];

  return (
    <Box className="expired-items-card">
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        Warehouse Inventory
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <DataTable
          columns={columns}
          data={items ?? []}
          isLoading={isLoading}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowCount={rowCount}
          paginationMode="server"
        />
      )}
    </Box>
  );
};

export default NewInventoryPage;
