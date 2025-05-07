import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { formatShortDate } from '../utils/formatDate';
import DataTable from './DataTable';
import { NumberInput } from '@mantine/core';
import {
  itemPurchaseBatches,
  updateItemMismatchInStockAPI,
} from '../utils/apiUtils';
import {
  setIsLoading,
  setPage as setReduxPage,
  setRowsPerPage as setReduxRowsPerPage,
  setSelectedItem,
  setshelfCount,
} from 'src/redux/inventoryPage/inventorySlice';
import { CONSTANTS } from 'src/constants/constants';
import { toast } from 'react-toastify';

const ItemPurchaseOrdersPage: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { selectedItem, isLoading } = useSelector(
    (state: RootState) => state.inventory
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [savingRowId, setSavingRowId] = useState<string | null>(null);
  // console.log(selectedItem);

  const fetchItemPurchaseBatchesApi = async () => {
    if (!selectedItem) {
      dispatch(setIsLoading(true));
      const response = await itemPurchaseBatches({ itemId: id });
      if (response?.success) {
        dispatch(setSelectedItem(response.data[0]));
        dispatch(setIsLoading(false));
      }
      if (response?.isError) {
        dispatch(setIsLoading(false));
      }
    }
  };

  const handleItemMismatchInStock = async (row: any) => {
    const rowId = row._id;
    setSavingRowId(rowId);
    const payload = {
      ...row,
      updateQuantity: row.updateQuantity,
      itemsId: selectedItem?._id,
    };
    const response = await updateItemMismatchInStockAPI(
      '67fcf517f8fd360aa5374e3d',
      payload,
      CONSTANTS.WAREHOUSE
    );
    if (response.isError) {
      setSavingRowId(null);
      toast.error('Unable to create transaction, please try again some time');
    }else {
      setSavingRowId(null);
      toast.success('transaction created successfully');
    }   
  };

  const mergedData =
    selectedItem?.itemShelfDates?.map(
      (shelfDate: InventoryPurchaseOrderItemShelfDate) => {
        const purchase = selectedItem.purchaseData.find(
          (p: InventoryPurchaseOrderEntry) =>
            p.purchaseOrderId === shelfDate.purchaseOrderId
        );
        return {
          _id: shelfDate._id,
          purchaseOrderId: shelfDate.purchaseOrderId,
          approveTime: purchase?.approveTime || '',
          draftTime: purchase?.draftTime || '',
          costPrice: purchase?.costPrice || 0,
          sellingPrice: purchase?.sellingPrice || 0,
          mrp: purchase?.mrp || 0,
          expiryDate: shelfDate.expiryDate,
          manufacturingDate: shelfDate.manufacturingDate,
          initialStockQuantity: shelfDate.initialStockQuantity,
          currentStockQuantity: shelfDate.currentStockQuantity,
          updateQuantity: shelfDate.updateQuantity || 0,
        };
      }
    ) ?? [];

  useEffect(() => {
    fetchItemPurchaseBatchesApi();
  }, [id]);

  const columns = [
    { key: 'purchaseOrderId', label: 'Purchase Order ID' },
    {
      key: 'draftTime',
      label: 'Draft Time',
      render: (row: any) => formatShortDate(row.draftTime),
    },
    {
      key: 'approveTime',
      label: 'Approve Time',
      render: (row: any) => formatShortDate(row.approveTime),
    },
    { key: 'costPrice', label: 'Cost Price' },
    { key: 'sellingPrice', label: 'Selling Price' },
    { key: 'mrp', label: 'MRP' },
    {
      key: 'expiryDate',
      label: 'Expiry Date',
      render: (row: any) => formatShortDate(row.expiryDate),
    },
    {
      key: 'manufacturingDate',
      label: 'Manufacturing Date',
      render: (row: any) => formatShortDate(row.manufacturingDate),
    },
    { key: 'initialStockQuantity', label: 'Initial Stock Qty' },
    { key: 'currentStockQuantity', label: 'Current Stock Qty' },
    {
      key: 'updateQty',
      label: 'Update Qty',
      render: (row: any) => (
        <NumberInput
          value={row.updatedStockQuantity ?? 0}
          onChange={(value) => {
            if (typeof value === 'number') {
              dispatch(
                setshelfCount({
                  _id: row._id,
                  updateQuantity: value,
                })
              );
            }
          }}
        />
      ),
    },
    {
      key: 'save',
      label: 'Save',
      render: (row: any) => (
        <Button
          variant="contained"
          loading={savingRowId === row._id}
          onClick={() => handleItemMismatchInStock(row)}
        >
          Save
        </Button>
      ),
    },
  ];

  return (
    <Box p={3}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      <Typography variant="h5" fontWeight={600} mb={2}>
        {selectedItem?.sku}
      </Typography>

      <DataTable
        columns={columns}
        data={mergedData}
        isLoading={isLoading}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={() => {}}
        onRowsPerPageChange={() => {}}
        rowCount={mergedData.length}
      />
    </Box>
  );
};

export default ItemPurchaseOrdersPage;
