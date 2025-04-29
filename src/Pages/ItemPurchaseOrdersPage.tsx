import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography, Box, Button, Chip } from '@mui/material';
import DataTable from './DataTable';
import { formatShortDate } from '../utils/formatDate';
import { InventoryTableRow, PurchaseEntry } from 'src/types';
import { generateColor } from 'src/utils/constants/generateColor';

type TableRow = PurchaseEntry & {
  _id: string;
};

const ItemPurchaseOrdersPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { item } = (location.state ?? {}) as {
    item: InventoryTableRow;
    purchases: PurchaseEntry[];
  };
  const purchases = item?.purchases;
  const renderPoDate = (row: TableRow) => (
    <Chip
      label={formatShortDate(row.purchaseDate)}
      size="small"
      sx={{
        backgroundColor: generateColor(row.purchaseOrderId),
        color: '#fff',
      }}
    />
  );

  const rowsWithId = useMemo<TableRow[]>(() => {
    const out: TableRow[] = [];
    for (const po of purchases ?? []) {
      if (!po.expiryDetails?.length) {
        out.push(Object.assign({ _id: po.purchaseOrderId }, po));
        continue;
      }

      po.expiryDetails.forEach((ed, i) => {
        out.push({
          ...po,
          manufacturing: String(ed.mfgDate),
          expiry: String(ed.date),
          leftShelfLife: ed.leftShelfLife,
          totalShelfLife: ed.totalShelfLife,
          qty: ed.value ?? po.qty,
          _id: `${po.purchaseOrderId}-${i}`,
          initialItemQuantity: ed.initialItemQuantity
        });
      });
    }

    return out;
  }, [purchases]);

  const columns = [
    {
      key: 'purchaseDate',
      label: 'Purchase Date',
      render: renderPoDate,
    },
    { key: 'cp', label: 'Cost Price' },
    { key: 'sp', label: 'Selling Price' },
    { key: 'qty', label: 'Quantity' },
    { key: 'initialItemQuantity', label: 'Initial Qty'},
    {
      key: 'manufacturing',
      label: 'MFG Date',
      render: (row: TableRow) => formatShortDate(row.manufacturing),
    },
    {
      key: 'expiry',
      label: 'Expiry Date',
      render: (row: TableRow) => formatShortDate(row.expiry),
    },
    { key: 'profitPercentage', label: 'Profit %' },
    { key: 'totalShelfLife', label: 'Shelf Life' },
    { key: 'leftShelfLife', label: 'Left Shelf Life' },
  ];
  return (
    <Box p={3}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <Typography variant="h5" fontWeight={600} mb={2}>
        {item?.sku}
      </Typography>

      <DataTable
        columns={columns}
        data={rowsWithId}
        isLoading={false}
        order="asc"
        orderBy="purchaseDate"
        page={0}
        rowsPerPage={rowsWithId.length || 10}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        rowCount={rowsWithId.length}
      />
    </Box>
  );
};

export default ItemPurchaseOrdersPage;
