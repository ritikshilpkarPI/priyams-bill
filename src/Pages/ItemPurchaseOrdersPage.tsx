import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Box, Button } from '@mui/material';
import DataTable from './DataTable';
import { formatShortDate } from '../utils/formatDate';
import { InventoryTableRow, PurchaseEntry } from 'src/types';

const ItemPurchaseOrdersPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item , purchases } = location.state as {item:  InventoryTableRow, purchases: PurchaseEntry[] } || {};
  
  const rowsWithId = useMemo(
    () =>
      purchases.map((row) => ({
        ...row,
        _id: row.purchaseOrderId,
      })),
    [purchases],
  );

  const columns = [
    {
      key: 'purchaseOrderId',
      label: 'PO ID',
    },
    {
      key: 'purchaseDate',
      label: 'Purchase Date',
      render: (row: PurchaseEntry) => formatShortDate(row.purchaseDate),
    },
    {
      key: 'cp',
      label: 'Cost Price',
    },
    {
      key: 'sp',
      label: 'Selling Price',
    },
    {
      key: 'qty',
      label: 'Quantity',
    },
    {
      key: 'manufacturing',
      label: 'MFG Date',
      render: (row: PurchaseEntry) => formatShortDate(row.manufacturing),
    },
    {
      key: 'expiry',
      label: 'Expiry Date',
      render: (row: PurchaseEntry) => formatShortDate(row.expiry),
    },
    {
      key: 'totalStockQty',
      label: 'Stock Qty',
    },
    {
      key: 'profitPercentage',
      label: 'Profit %',
    },
    {
      key: 'totalShelfLife',
      label: 'Shelf Life',
    },
    {
      key: 'leftShelfLife',
      label: 'Left Shelf Life',
    },
  ];

  return (
    <Box p={3}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <Typography variant="h5" fontWeight={600} mb={2}>
        Purchase Orders for: {item?.itemName} ({item?.itemBarcode})
      </Typography>

      <DataTable
        columns={columns}
        data={rowsWithId || []}
        isLoading={false}
        order={'asc'}
        orderBy={'purchaseDate'}
        onSort={() => {}}
        page={0}
        rowsPerPage={purchases?.length || 10}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        rowCount={purchases?.length || 0}
      />
    </Box>
  );
};

export default ItemPurchaseOrdersPage;
