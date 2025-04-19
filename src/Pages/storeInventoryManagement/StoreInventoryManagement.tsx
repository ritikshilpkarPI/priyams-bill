import React, { useEffect, useState } from 'react';
import {
  Title,
  Button,
  Group,
  Paper,
  Box,
  Flex,
  Grid,
  Text,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { ItemSearch } from '../../components/ItemSearch';
import { StoreSelect } from '../../components/StoreSelect';
import { InventoryItemPanel } from '../../components/InventoryItemPanel';
import {
  setSelectedStore,
  addInventoryItem,
  updateInventoryItemQuantity,
  removeInventoryItem,
  resetStoreInventory,
  setStores,
  setDestinationStaff,
  setSourceStaff,
} from '../../redux/storeInventoryManagement/storeInventoryManagementSlice';
import {
  addNewStockTransactionsAPI,
  getAllStaffsByStoreIdAPI,
  getAllStoresAPI,
  transferStockToStoreAPI,
} from '../../utils/apiUtils';
import { useMediaQuery } from '@mantine/hooks';
// import { StoreInventoryManagementValidation } from '../../utils/validations/StoreInventoryManagementValidation';
import { getYupValidationErrorMap } from '../../utils/getYupValidationErrorMap';
import { fetchBillingLeanItems } from 'src/utils/fetchBillingLeanItems';
import { AppDispatch } from '../../redux/store';
import { toast } from 'react-toastify';
import {
  addTransactionDestination,
  addTransactionItem,
  addTransactionSource,
  removeTransactionItem,
  updateTransactionItemQuantity,
} from '../../redux/stockTransactionManagement/StockTransactionManagement';
import StoreInventoryForm from 'src/components/storeInventoryForm/StoreInventoryForm';
import { destinationValidation, sourceValidation } from 'src/utils/validations/StoreInventoryManagementValidation';

const StoreInventoryManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const storeInventory = useSelector(
    (state: RootState) => state.storeInventoryManagement
  );

  const selectedStoreId = useSelector(
    (state: RootState) => state.storeInventoryManagement.selectedStoreId
  );
  const inventoryItems = useSelector(
    (state: RootState) => state.storeInventoryManagement.inventoryItems
  );

  const stockTransaction = useSelector(
    (state: RootState) => state.stockTransaction
  );

  const stores = useSelector(
    (state: RootState) => state.storeInventoryManagement.stores
  );

  const transactionItems = useSelector(
    (state: RootState) => state.stockTransaction.transactionItems
  );

  const transactionSource = useSelector(
    (state: RootState) => state.stockTransaction.source
  );

  const transactionDestination = useSelector(
    (state: RootState) => state.stockTransaction.destination
  );

  const sourceStaff = useSelector(
    (state: RootState) => state.storeInventoryManagement.sourceStaff
  );
  const destinationStaff = useSelector(
    (state: RootState) => state.storeInventoryManagement.destinationStaff
  );

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await getAllStoresAPI();
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

  const [errors, setErrors] = useState<YupValidationErrorMapType>({});
  const [loading, setLoading] = useState(false);

  const handleStoreChange = (storeId: string) => {
    dispatch(setSelectedStore(storeId));
  };

  const handleItemSelect = (item: ItemWithQuantity) => {
    // Check if item already exists in the inventory items
    if (
      inventoryItems.find(
        (invItem) => invItem.itemDetail._id === item.itemDetail._id
      )
    ) {
      showNotification({ message: 'Item already added', color: 'yellow' });
      return;
    }

    const newTransactionItem: TransactionItemType = {
      itemId: item.itemDetail._id ?? '',
      itemBarcode: item.itemDetail.itemBarcode ?? '',
      itemMRPperUnit: item.itemDetail.itemMRPperUnit ?? 0,
      itemName: item.itemDetail.itemName ?? '',
      itemQtyInStore: item.itemDetail.itemQtyInStore ?? 0,
      itemStockQuantity: item.itemDetail.itemStockQuantity ?? 0,
      itemSellingPricePerUnit: item.itemDetail.itemSellingPricePerUnit ?? 0,
      itemShelfDates: item.itemDetail.itemShelfDates ?? [],
      totalQtyAdd: 0,
      sku: item.itemDetail.sku ?? '',
      itemByDate: item.itemDetail.itemShelfDates
        ? item.itemDetail.itemShelfDates.map((shelf) => ({
          sourceQuantity: {
            expiryDate: shelf.expiryDate,
            manufacturingDate: shelf.manufacturingDate,
            qty: shelf.quantityToAdd,
            quantity: shelf.quantity,
          },
          shelfId: shelf._id,
        }))
        : [],
    };
    dispatch(addTransactionItem(newTransactionItem));
  };

  const handleQuantityChange = (
    itemId: string,
    quantity: number,
    shelfId?: string
  ) => {
    dispatch(updateTransactionItemQuantity({ itemId, quantity, shelfId }));
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeTransactionItem(itemId));
  };
  const convertToItemsArray = () => {
    const itemsArray = [];
    for (const item of inventoryItems) {
      itemsArray.push({
        itemId: item.itemDetail._id,
        quantity: item.quantityToAdd,
        itemShelfDates: item?.itemShelfDates ?? [],
      });
    }
    return itemsArray;
  };  

  const validateInventoryItems = () => {
    const errors: YupValidationErrorMapType = {};
    inventoryItems.forEach((item) => {
      const totalShelfQuantity = item.itemDetail.itemShelfDates?.reduce(
        (acc: any, shelf: { quantityToAdd: any }) => acc + shelf.quantityToAdd,
        0
      );
      if (totalShelfQuantity > item.quantityToAdd) {
        errors.inventoryItems = 'Shelf quantities exceed total quantity';
      }
      if (totalShelfQuantity !== 0 && totalShelfQuantity < item.quantityToAdd) {
        errors.inventoryItems =
          'Total quantity should be equal to shelf quantities';
      }
    });
    return errors;
  };

  const onSubmitTransaction = async () => {

    addNewStockTransactionsAPI(stockTransaction)
        
  }

  const onChangeTransactionSource = (field: string, value: string | number) => {
    dispatch(addTransactionSource({ ...transactionSource, [field]: value }));
  };
  const onChangeTransactionDestination = (
    field: string,
    value: string | number
  ) => {
    dispatch(
      addTransactionDestination({ ...transactionDestination, [field]: value })
    );
  };

  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const storesData = stores
    .filter((dealer) => dealer.type === 'STORE')
    .map((store) => ({
      value: store._id ?? '',
      label: store.code + ' - ' + store.name,
    }));

  const warehouseData = stores
    .filter((dealer) => dealer.type === 'WAREHOUSE')
    .map((store) => ({
      value: store._id ?? '',
      label: store.code + ' - ' + store.name,
    }));

  const fetchDestinationStaffs = async (storeId: string) => {
    try {
      const response = await getAllStaffsByStoreIdAPI(storeId ?? '');
      if (response.success) {
        dispatch(setDestinationStaff(response.data));
      } else {
        dispatch(setDestinationStaff([]));
      }
    } catch (error) {
      dispatch(setDestinationStaff([]));
      toast.error('Failed to fetch staff');
    }
  };

  const fetchSourceStaffs = async (storeId: string) => {
    try {
      const response = await getAllStaffsByStoreIdAPI(storeId ?? '');
      if (response.success) {
        dispatch(setSourceStaff(response.data));
      } else {
        dispatch(setSourceStaff([]));
      }
    } catch (error) {
      dispatch(setSourceStaff([]));
      toast.error('Failed to fetch staff');
    }
  };

  useEffect(() => {
    fetchDestinationStaffs(transactionDestination.destinationEntityId);
  }, [stockTransaction.destination.destinationEntityId]);

  useEffect(() => {
    fetchSourceStaffs(transactionSource.sourceEntityId);
    dispatch(fetchBillingLeanItems('', transactionSource.sourceEntityId));
  }, [stockTransaction.source.sourceEntityId]);

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
            Store Inventory Management
          </Title>
        </Grid.Col>

        <Grid.Col>
          <StoreInventoryForm
            onChangeSource={onChangeTransactionSource}
            onChangeDestination={onChangeTransactionDestination}
            storesData={storesData}
            warehouseData={warehouseData}
            sourceStaff={sourceStaff.map((staff) => ({
              value: staff._id,
              label: staff.name,
            }))}
            destinationStaff={destinationStaff.map((staff) => ({
              value: staff._id,
              label: staff.name,
            }))}
          />
        </Grid.Col>

        {Boolean(stockTransaction.source.sourceType) && (
          <Grid.Col span={12}>
            <ItemSearch
              onItemSelect={handleItemSelect}
              // passing the selected store id to the item search to disable the items search
              isApprovedPO={!stockTransaction.source.sourceEntityId}
              error={errors.inventoryItems}
            />
            {!stockTransaction.source.sourceEntityId && (
              <Text
                sx={{
                  color: 'red',
                  fontSize: '12px',
                  marginTop: '4px',
                }}
              >
                Please select a Source Store to add items.
              </Text>
            )}
          </Grid.Col>
        )}

        <Grid.Col span={12}>
          {transactionItems.length > 0 && (
            <InventoryItemPanel
              items={transactionItems}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
            />
          )}
        </Grid.Col>

        <Grid.Col span={isSmallScreen ? 12 : 4}>
          <Button 
          loading={loading} 
          w="100%"
          onClick={onSubmitTransaction}
          >
            Transfer Inventory
          </Button>
        </Grid.Col>
      </Grid>
    </Flex>
  );
};

export default StoreInventoryManagement;