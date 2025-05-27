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
  Box,
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
import { setSelectedItemsIds } from '../../redux/storeInventoryManagement/storeInventoryManagementSlice';
import {
  getAllStoresAPI,
  getItemsFromStoreInventoryAPI,
  updateItemMismatchInStockAPI,
} from '../../utils/apiUtils';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import { AppDispatch } from '../../redux/store';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import DataTable from '../DataTable';
import { toast } from 'react-toastify';
import { IconTrashX } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import { CONSTANTS } from 'src/constants/constants';
import ItemSearchInput from 'src/components/itemSearchInput/ItemSearchInput';
import { Typography } from '@mui/material';
import { DownloadItemCSVButton } from 'src/components/DownloadItemCSVButton';

const StoreInventory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { selectedStoreId, stores, items, itemCount, selecteditem, isLoading } =
    useSelector((state: RootState) => state.storeInventory);
  const { selectedItemsIds } = useSelector(
    (state: RootState) => state.storeInventoryManagement
  );

  const [itemsId, setItemsId] = useState<string | null>(null);
  const [firstOpened, firstHandlers] = useDisclosure(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

    if (!stores?.length) fetchStores();
  }, [dispatch]);

  const storeId = stores.find((s) => s.code === selectedStoreId)?._id;

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
        itemsId: selecteditem?._id ?? '',
        shelfDateId: row._id,
        value: Number(0),
      })
    );
    setMismatchloading(false);

    toast.success('create transaction successfully');
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
      key: 'sku',
      label: 'SKU',
    },
    {
      key: 'itemBarcode',
      label: 'Bar Code',
    },
    {
      key: 'itemName',
      label: 'Item Name',
    },
    {
      key: 'itemPerUnitQuantity',
      label: 'Packet Qty.',
    },
    { key: 'quantityUnitName', label: 'Unit' },
    { key: 'itemMRPperUnit', label: 'MRP' },
    { key: 'itemBrandName', label: 'Brand Name' },
    {
      key: 'itemCategory',
      label: 'Category',
    },
    { key: 'subCategory', label: 'Sub Category' },
    { key: 'itemQuantityInStore', label: 'Store Stock' },
    { key: 'companyName', label: 'Company' },
    {
      key: 'flavourOrFeature',
      label: 'Flavour Or Feature',
    },
    { key: 'saleTime', label: 'Sale Time' },
    {
      key: 'itemShelfDates',
      label: 'Item Shelf Dates',
      render: (row: any) => (
        <Button
          onClick={() => {
            setItemsId(row._id === itemsId ? null : row._id);
            firstHandlers.open();
          }}
        >
          {row._id === itemsId ? 'Hide' : 'Show'}{' '}
          {`( ${row.itemShelfDates?.length ? row.itemShelfDates.length : 0} )`}
        </Button>
      ),
    },
  ];
  
  return (
    <Box className="expired-items-card">
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
              Store Inventory
        </Typography>
    
      <Grid columns={12} sx={{ width: '100%' }}>
        <Grid.Col span={isSmallScreen ? 12 : 4} sx={{ textAlign: 'left' }}>
          <StoreSelect
            stores={stores}
            value={selectedStoreId ?? ''}
            onChange={handleStoreChange}
          />
        </Grid.Col>
        <Grid.Col
          span={isSmallScreen ? 12 : 4}
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            w={'100%'}
            disabled={selectedItemsIds?.length < 1}
            onClick={() =>
              navigate('/stockTransactions', {
                state: { fromStoreInventory: true },
              })
            }
          >
            View Transactions
          </Button>
        </Grid.Col>
        <Grid.Col span={isSmallScreen ? 12 : 4} sx={{ textAlign: 'left',display:"flex", alignItems: "end", justifyContent:"end"}}>
          <DownloadItemCSVButton
          sourceType={CONSTANTS.STORE}
          storeId = {storeId ?? ""}
          />
        </Grid.Col>
        <Grid.Col 
         sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
          }}
         span={isSmallScreen ? 12 : 5}
        >
          <ItemSearchInput
            placeholder="Search item by name or barcode"
            page={page}
            rowsPerPage={rowsPerPage}
            searchType={CONSTANTS.STORE}
            storeId={storeId ?? ''}
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
            rowCount={itemCount}
            paginationMode="server"
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
              page={1}
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
    </Box>
  );
};

export default StoreInventory;
