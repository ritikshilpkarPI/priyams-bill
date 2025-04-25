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
} from 'src/redux/inventoryPage/inventorySlice';
import { useSelector } from 'react-redux';
import { InventoryRow, InventoryTableRow } from 'src/types';

const NewInventoryPage: React.FC = () => {
  const dispatch = useDispatch();
  const { cache, items, page, rowsPerPage, rowCount, isLoading } = useSelector(
    (state: RootState) => state.inventory
  );
  const navigate = useNavigate();
  /* key that uniquely describes the request */
  const cacheKey = `${rowsPerPage}-${page}`;
  const getItemPurchaseBatches = async () => {
    const rowsInCache = cache[cacheKey];

    if (rowsInCache) {
      dispatch(showRows(rowsInCache));
      return;
    }
    try {
      const res = await itemPurchaseBatches(page + 1, rowsPerPage);
      const data = res.data as Record<string, InventoryRow> ;
      const rows : InventoryTableRow [] = Object.values(data).map(
        (entry , idx: number) => {
          const { _id : _ , ...restStaticData } = entry.staticData
          return {
          _id: entry.staticData._id ?? `row-${page}-${idx}`,
          ...restStaticData,
          purchases: entry.purchases ?? [],
        }},
      );

      /* put in cache + show */
      dispatch(putPageInCache({ key: cacheKey, rows }));
      dispatch(showRows(rows));
      dispatch(setRowCount(res.totalCount));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    getItemPurchaseBatches();
  }, [page, rowsPerPage, cacheKey, cache, dispatch]);

  const handlePageChange = (_: unknown, newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleRowsPerPageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(setRowsPerPage(parseInt(e.target.value.toString(), 10)));
  };

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
      key: 'showPOs',
      label: 'Show POs',
      render: (row: InventoryRow) => (
        <button
          onClick={() =>
            navigate('/item-purchase-orders', {
              state: {
                item: row,
                purchases: row.purchases || [],
              },
            })
          }
          style={{
            padding: '4px 8px',
            backgroundColor: '#2e7d32',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Show POs
        </button>
      ),
    },
  ];

  return (
    <Box className="expired-items-card">
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        Inventory Page
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <DataTable
          columns={columns}
          data={items}
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
