import React, { useEffect, useState } from 'react';
import {
  Title,
  Flex,
  Grid,
  Button,
  Drawer,
  NumberInput,
  ScrollArea,
  LoadingOverlay,
  Text,
  ActionIcon,
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
  setSelectedItemsIds
} from '../../redux/storeInventoryManagement/storeInventoryManagementSlice';
import {
  getAllStoresAPI,
  getItemsFromStoreInventory,
  updateItemMismatchInStockAPI,
} from '../../utils/apiUtils';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import { AppDispatch } from '../../redux/store';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import DataTable from '../DataTable';
import { toast } from 'react-toastify';
import { IconTrashX } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import { setPrevLocation } from 'src/redux/stockTransactions/stockTransactionsSlice';

const StoreInventory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedStoreId, stores, items, itemCount, selecteditem } =
    useSelector((state: RootState) => state.storeInventory);
    const { selectedItemsIds } = useSelector(
      (state: RootState) => state.storeInventoryManagement
    );

  const [loading, setLoading] = useState(false);
  const [itemsId, setItemsId] = useState<string | null>(null);
  const [firstOpened, firstHandlers] = useDisclosure(false);
  const [pagination, setPagination] = useState({ size: 100, page: 1 });
  const [mismatchloading, setMismatchloading] = useState(false);
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

    if(!stores?.length) fetchStores();
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

  const handleItemMismatchInStock = async (
    row: any,
    isDelete: boolean = false
  ) => {
    setMismatchloading(true);
    const store = stores.find((store) => store.code === selectedStoreId);
    if (!store) throw new Error('Store not found');

    const payload = {
      ...row,
      updateQuantity: isDelete ? 0 : row.updateQuantity,
      itemsId: selecteditem?._id,
    };

    const response = await updateItemMismatchInStockAPI(
      store._id ?? '',
      payload
    );

    if (response.isError) {
      setMismatchloading(false);
      toast.error('Unable to create transaction, please try again some time');
    }
    dispatch(
      updateItem({
        itemsId: selecteditem?._id ?? "",
        shelfDateId: row._id,
        value: Number(0),
      })
    );
    setMismatchloading(false);

    toast.success('create transaction successfully');
  };

  const columns: GridColDef[] = [
    { field: 'sku', headerName: 'SKU', headerAlign: 'left', align: 'left', minWidth: 200 },
    {
      field: 'itemBarcode',
      headerName: 'Bar Code',
      minWidth: 150,
    },
    {
      field: 'itemName',
      headerName: 'Item Name',
      minWidth: 150,
    },
    {
      field: 'itemPerUnitQuantity',
      headerName: 'Packet Qty.',
    },
    { field: 'quantityUnitName', headerName: 'Unit' },
    { field: 'itemMRPperUnit', headerName: 'MRP' },
    { field: 'itemBrandName', headerName: 'Brand Name' },
    {
      field: 'itemCategory',
      headerName: 'Category',
    },
    { field: 'subCategory', headerName: 'Sub Category' },
    { field: 'itemQuantityInStore', headerName: 'Store Stock' },
    { field: 'companyName', headerName: 'Company' },
    {
      field: 'flavourOrFeature',
      headerName: 'Flavour Or Feature',
    },
    { field: 'saleTime', headerName: 'Sale Time' },
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
          {params.row._id === itemsId ? 'Hide' : 'Show'}{' '}
          {`( ${params.row.itemShelfDates?.length ? params.row.itemShelfDates.length : 0} )`}
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
        <Grid.Col span={isSmallScreen ? 12 : 4} sx={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}>
          <Button disabled={selectedItemsIds?.length < 1}
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
              minWidth: col?.minWidth ?? 100,
              headerAlign: col?.headerAlign ?? 'center',
              align: col?.align ?? 'center',
              sortable: col?.sortable ?? true,
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
        <LoadingOverlay visible={mismatchloading} zIndex={1} />
        <ScrollArea
          h={isSmallScreen ? '70vh' : '100vh'}
          type="auto"
          scrollbarSize={4}
        >
          {selecteditem && selecteditem?.itemShelfDates && (
            <DataTable
              columns={[
                {
                  key: 'expiryDate',
                  label: 'Expiry Date',
                  render: (row: any) => (
                    <Flex
                      h={'100%'}
                      align={'center'}
                      justify={'center'}
                      gap={10}
                    >
                      <Text size="md">
                        {row.expiryDate
                          ? new Date(row.expiryDate).toLocaleDateString()
                          : 'N/A'}
                      </Text>
                    </Flex>
                  ),
                },
                {
                  key: 'manufacturingDate',
                  label: 'Manufacturing Date',
                  render: (row: any) => (
                    <Flex
                      h={'100%'}
                      align={'center'}
                      justify={'center'}
                      gap={10}
                    >
                      <Text size="md">
                        {row.manufacturingDate
                          ? new Date(row.manufacturingDate).toLocaleDateString()
                          : 'N/A'}
                      </Text>
                    </Flex>
                  ),
                },
                { key: 'currentStockQuantity', label: 'Quantity' },
                {
                  key: 'updateQuantity',
                  label: 'Update Qty',
                  render: (row: any, record: any) => (
                    <Flex h={'100%'} align={'center'} gap={10}>
                      <NumberInput
                        w="300px"
                        min={0}
                        value={row.updateQuantity ?? 0}
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
                  key: 'save',
                  label: 'Save',
                  render: (row: any) => (
                    <Button
                      disabled={!row.updateQuantity}
                      onClick={() => handleItemMismatchInStock(row)}
                    >
                      Save
                    </Button>
                  ),
                },
                {
                  key: 'delete',
                  label: 'Delete',
                  render: (row: any) => (
                    <Flex
                      h={'100%'}
                      align={'center'}
                      justify={'center'}
                      gap={10}
                    >
                      <ActionIcon
                        variant="filled"
                        color="red"
                        aria-label="Settings"
                        onClick={() => handleItemMismatchInStock(row, true)}
                      >
                        <IconTrashX
                          style={{ width: '70%', height: '70%' }}
                          stroke={1.5}
                        />
                      </ActionIcon>
                    </Flex>
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
