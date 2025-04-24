import React, { useEffect, useState } from 'react';
import {
  Title,
  Flex,
  Grid,
  Button,
  Drawer,
  NumberInput,
  ScrollArea,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { StoreSelect } from '../../components/StoreSelect';
import {
  setSelectedStore,
  setStores,
  setItems,
  setItemCount,
  updateItem,
  setSelectedItem,
} from '../../redux/storeInventory/StoreInventoryState';
import {
  getAllStoresAPI,
  getItemsFromStoreInventory,
} from '../../utils/apiUtils';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import { AppDispatch } from '../../redux/store';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import DataTable from '../DataTable';

const StoreInventory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedStoreId, stores, items, itemCount, selecteditem } =
    useSelector((state: RootState) => state.storeInventory);

  const [loading, setLoading] = useState(false);
  const [itemsId, setItemsId] = useState<string | null>(null);
  const [firstOpened, firstHandlers] = useDisclosure(false);
  const [pagination, setPagination] = useState({ size: 100, page: 1 });

  const isSmallScreen = useMediaQuery('(max-width: 768px)');

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

    fetchStores();
  }, [dispatch]);

  useEffect(() => {
    const getItemRequest = async (storeId: string) => {
      try {
        setLoading(true);
        const res: any = await getItemsFromStoreInventory(storeId, pagination);
        dispatch(setItems(res?.data?.data || []));
        dispatch(setItemCount(res?.data?.count || 0));
      } catch (error) {
        showNotification({ message: 'Failed to load Items', color: 'red' });
      } finally {
        setLoading(false);
      }
    };

    if (selectedStoreId) {
      const storeId = stores.find((s) => s.code === selectedStoreId)?._id;
      if (storeId) getItemRequest(storeId);
    }
  }, [selectedStoreId, stores, pagination]);

  useEffect(() => {
    if (itemsId) {
      const row = items.find((item: any) => item._id === itemsId);
      dispatch(setSelectedItem(row || null));
    } else {
      dispatch(setSelectedItem(null));
    }
  }, [itemsId, items]);

  const handleStoreChange = (storeId: string) => {
    dispatch(setSelectedStore(storeId));
  };

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
    {
      field: 'itemShelfDates',
      headerName: 'Item Shelf Dates',
      renderCell: (params: any) => (
        <Button
          onClick={() => {
            setItemsId(params.row._id === itemsId ? null : params.row._id);
            firstHandlers.open();
          }}
        >
          {params.row._id === itemsId ? 'Hide' : 'Show'}
        </Button>
      ),
    },
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
            value={selectedStoreId ?? ''}
            onChange={handleStoreChange}
          />
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
          />
        </Grid.Col>
      </Grid>

      <Drawer
        position={isSmallScreen ? 'top' : 'right'}
        padding={7}
        size="80vh"
        opened={firstOpened}
        onClose={() => {
          firstHandlers.close();
          setItemsId(null);
        }}
        title={`${selecteditem?.itemName}`}
      >
        <ScrollArea h={isSmallScreen ? '70vh' : "100vh"} type="auto" scrollbarSize={4}>
          {selecteditem && selecteditem?.itemShelfDates && (
            <DataTable
              columns={[
                { key: 'expiryDate', label: 'Expiry Date' },
                { key: 'manufacturingDate', label: 'Manufacturing Date' },
                { key: 'currentStockQuantity', label: 'Quantity' },
                {
                  key: 'updateQuantity',
                  label: 'Update Qty',
                  render: (row: any, record: any) => (
                    <Flex h={'100%'} align={'center'} gap={10}>
                      <NumberInput
                        w={'300px'}
                        value={row.updateQuantity}
                        onChange={(value) => {
                          dispatch(
                            updateItem({
                              itemsId: selecteditem._id,
                              shelfDateId: row._id,
                              value: Number(value),
                            })
                          );
                        }}
                      />
                    </Flex>
                  ),
                },
                {
                  key: '',
                  label: 'Save',
                  render: (row: any) => (
                    <Button onClick={() => console.log(row)}>Save</Button>
                  ),
                },
              ]}
              data={selecteditem?.itemShelfDates}
              isLoading={false}
              page={0}
              rowsPerPage={selecteditem?.itemShelfDates?.length}
              onPageChange={() => {}}
              onRowsPerPageChange={() => {}}
              rowCount={selecteditem?.itemShelfDates?.length}
              paginationMode="client"
              order="asc"
              orderBy=""
              onSort={() => {}}
            />
          )}
        </ScrollArea>
      </Drawer>
    </Flex>
  );
};

export default StoreInventory;
