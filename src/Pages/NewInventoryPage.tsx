import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import { itemPurchaseBatches } from '../utils/apiUtils';
import DataTable from './DataTable';
import { useNavigate } from 'react-router';

const NewInventoryPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('itemName');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [rowCount, setRowCount] = useState<number>(0);

  const navigate = useNavigate();

  const getItemPurchaseBatches = async () => {
    try {
      setIsLoading(true);
      const itemData = await itemPurchaseBatches(page + 1, rowsPerPage);

      const staticRows: any[] = Object.values(itemData.data).map((entry: any, index: number) => ({
        id: entry.staticData._id || `row-${page}-${index}`,
        ...entry.staticData,
        purchases: entry.purchases || [], // ✅ inject PO data here
      }));

      setItems(staticRows);
      setRowCount(itemData.totalCount);
    } catch (error) {
      console.error('Failed to fetch item batches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getItemPurchaseBatches();
  }, [page, rowsPerPage]);

  const handleSort = (columnKey: string) => {
    const isAsc = orderBy === columnKey && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnKey);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(e.target.value.toString(), 10));
  };

  const columns = [
    {
      key: 'itemName',
      label: 'Item Name',
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
      render: (row: any) => (
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
          order={order}
          orderBy={orderBy}
          onSort={handleSort}
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
