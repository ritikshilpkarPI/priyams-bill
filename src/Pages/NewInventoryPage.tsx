import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import { itemPurchaseBatchesAPI } from '../utils/apiUtils';
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
import { Grid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import ItemSearchInput from 'src/components/itemSearchInput/ItemSearchInput';
import { CONSTANTS } from 'src/constants/constants';

const NewInventoryPage: React.FC = () => {
  const dispatch = useDispatch();
  const { cache, items, page, rowsPerPage, rowCount, isLoading } = useSelector(
    (state: RootState) => state.inventory
  );
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const navigate = useNavigate();
  const cacheKey = `${rowsPerPage}-${page}`;


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
      key: 'itemName',
      label: 'Item Name',
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
      key: 'companyName',
      label: 'Company',
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

      <Grid>
        <Grid.Col span={isSmallScreen ? 12 : 5} sx={{ textAlign: 'left' }}>
          <ItemSearchInput
            placeholder="Search item by name or barcode"
            page={page}
            rowsPerPage={rowsPerPage}
            searchType={CONSTANTS.WAREHOUSE}
          />
        </Grid.Col>

        <Grid.Col span={12}>
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
        </Grid.Col>
      </Grid>
    </Box>
  );
};

export default NewInventoryPage;
