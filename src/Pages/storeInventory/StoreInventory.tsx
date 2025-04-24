import React, { useEffect, useState } from 'react';
import { Title, Flex, Grid, Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { StoreSelect } from '../../components/StoreSelect';
import {
  setSelectedStore,
  setStores,
  setSelectedItemsIds
} from '../../redux/storeInventoryManagement/storeInventoryManagementSlice';
import {
  getAllStoresAPI,
  getItemsFromStoreInventory,
} from '../../utils/apiUtils';
import { useMediaQuery } from '@mantine/hooks';
import { AppDispatch } from '../../redux/store';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { formatShortDate } from '../../utils/formatDate';
import { useNavigate } from 'react-router';
import { setPrevLocation } from 'src/redux/stockTransactions/stockTransactionsSlice';

const StoreInventory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedStoreId, stores, selectedItemsIds } = useSelector(
    (state: RootState) => state.storeInventoryManagement
  );
  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(items.length);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({ size: 100, page: 1 });
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res: any = await getAllStoresAPI();
        if (!res.stores) {
          showNotification({ message: 'No stores found', color: 'red' });
          return;
        }
        dispatch(setStores(res.stores));
      } catch (error) {
        showNotification({ message: 'Failed to load stores', color: 'red' });
      }
    };

    if(!stores.length) fetchStores();
  }, [dispatch]);

  useEffect(() => {
    const getItemRequest = async (storeId: string) => {
      try {
        setLoading(true);
        const res: any = await getItemsFromStoreInventory(storeId, pagination);
        setItems(res?.data?.data || []);
        setItemCount(res?.data?.count || 0);
      } catch (error) {
        showNotification({ message: 'Failed to load Items', color: 'red' });
      } finally {
        setLoading(false);
      }
    };
    if (selectedStoreId) {
      const storeId = stores.find((s) => s.code === selectedStoreId)?._id;
      storeId && getItemRequest(storeId);
    }
  }, [selectedStoreId, stores, pagination]);

  const handleStoreChange = (storeId: string) => {
    dispatch(setSelectedStore(storeId));
  };

  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const columns: GridColDef[] = [
    { field: 'sku', headerName: 'SKU', sortable: true },
    {
      field: 'itemBarcode',
      headerName: 'Bar Code',
      sortable: true,
      minWidth: 150,
    },
    {
      field: 'itemName',
      headerName: 'Item Name',
      sortable: true,
      minWidth: 150,
    },
    {
      field: 'itemPerUnitQuantity',
      headerName: 'Packet Qty.',
      sortable: true,
    },
    { field: 'quantityUnitName', headerName: 'Unit', sortable: true },
    { field: 'itemMRPperUnit', headerName: 'MRP/Unit', sortable: true },
    { field: 'itemBrandName', headerName: 'Brand Name', sortable: true },
    {
      field: 'itemCategory',
      headerName: 'Category',
      sortable: true,
    },
    
    { field: 'subCategory', headerName: 'Sub Category', sortable: true },
    { field: 'itemStockQuantity', headerName: 'Total Stock', sortable: true },
    { field: 'companyName', headerName: 'Company', sortable: true },
    {
      field: 'flavourOrFeature',
      headerName: 'Flavour Or Feature',
      sortable: true,
    },
    { field: 'saleTime', headerName: 'Sale Time', sortable: true },
  ];

  return (
    <Flex
      gap="16px"
      direction="column"
      sx={{
        border: '1px solid grey',
        padding: '16px',
        borderRadius: '8px',
        overflow: 'scroll',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
      mx="sm"
      mt="16px"
    >
      <Grid columns={12} sx={{ width: '100%' }}>
        <Grid.Col span={12}>
          <Title order={2} mb="md">
            Store Inventory
          </Title>
        </Grid.Col>
        <Grid.Col span={isSmallScreen ? 12 : 4} sx={{ textAlign: 'left' }}>
          <StoreSelect
            stores={stores}
            value={selectedStoreId}
            onChange={handleStoreChange}
          />
        </Grid.Col>
        <Grid.Col span={isSmallScreen ? 12 : 4} sx={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
          <Button disabled={selectedItemsIds.length < 1}
           onClick={()=>{
            dispatch(setPrevLocation(window.location.pathname));
            navigate("/stockTransactions");
          }}
          >View Transactions</Button>
        </Grid.Col>
        <Grid.Col span={12}>
          <DataGrid
            columns={columns.map((col) => ({
              ...col,
              flex: 1,
              minWidth: col.minWidth ?? 100,
              headerAlign: 'center',
              align: 'center',
            }))}
            rows={items}
            paginationModel={{
              pageSize: pagination.size,
              page: pagination.page - 1,
            }}
            onPaginationModelChange={({ page, pageSize }) => {
              const newPage = page + 1;
              if (pagination.page !== newPage || pagination.size !== pageSize) {
                setPagination({ page: newPage, size: pageSize });
              }
            }}
            rowCount={itemCount}
            paginationMode="server"
            pageSizeOptions={[5, 10, 20, 50, 100]}
            loading={loading}
            getRowId={(row) =>
              row.id || row._id || row.key || JSON.stringify(row)
            }
            disableRowSelectionOnClick
            slots={{ toolbar: GridToolbar }}
            checkboxSelection
            onRowSelectionModelChange={(model)=>dispatch(setSelectedItemsIds((model as string[])))}
            rowSelectionModel={selectedItemsIds}
          />
        </Grid.Col>
      </Grid>
    </Flex>
  );
};

export default StoreInventory;
