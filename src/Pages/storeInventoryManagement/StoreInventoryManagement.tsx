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
} from '../../redux/storeInventoryManagement/storeInventoryManagementSlice';
import { getAllStoresAPI, transferStockToStoreAPI } from '../../utils/apiUtils';
import { useMediaQuery } from '@mantine/hooks';
import { StoreInventoryManagementValidation } from '../../utils/validations/StoreInventoryManagementValidation';
import { getYupValidationErrorMap } from '../../utils/getYupValidationErrorMap';
import { fetchBillingLeanItems } from 'src/utils/fetchBillingLeanItems';
import { AppDispatch } from '../../redux/store';
import { toast } from 'react-toastify';

const StoreInventoryManagement: React.FC = () => {
  // const dispatch = useDispatch();
  const dispatch = useDispatch<AppDispatch>()
  const storeInventory = useSelector(
    (state: RootState) => state.storeInventoryManagement
  );

  const selectedStoreId = useSelector(
    (state: RootState) => state.storeInventoryManagement.selectedStoreId
  );
  const inventoryItems = useSelector(
    (state: RootState) => state.storeInventoryManagement.inventoryItems
  );

  const stores = useSelector(
    (state: RootState) => state.storeInventoryManagement.stores
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
    const newItem: StoreInventoryItem = { ...item, quantityToAdd: 1 };
    dispatch(addInventoryItem(newItem));
  };

  const handleQuantityChange = (itemId: string, quantity: number, shelfId?: string) => {
    dispatch(updateInventoryItemQuantity({ itemId, quantity, shelfId }));
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeInventoryItem(itemId));
  };
  const convertToItemsArray = () => {
    const itemsArray = [];
    for (const item of inventoryItems) {
      itemsArray.push({
        itemId: item.itemDetail._id,
        quantity: item.quantityToAdd,
        itemShelfDates: item?.itemShelfDates ?? []
      });
    }
    return itemsArray;
  };  

  const updateStore = async ()=>{
    setLoading(true);
    const items = convertToItemsArray();
    const response = await transferStockToStoreAPI(selectedStoreId, items);
    if (response.isError){
      setLoading(false);
      return toast.error(
              'unable to update store, please try again some time'
            );
    }
    dispatch(resetStoreInventory());
    dispatch(fetchBillingLeanItems())
    setLoading(false);
    toast.success('store update successfully');
  }

const validateInventoryItems = () => {
  const errors: YupValidationErrorMapType = {};
  inventoryItems.forEach((item) => {
    const totalShelfQuantity = item.itemDetail.itemShelfDates?.reduce(
      (acc: any, shelf: { quantityToAdd: any; }) => acc + shelf.quantityToAdd,
      0
    );
    if (totalShelfQuantity > item.quantityToAdd) {
      errors.inventoryItems = 'Shelf quantities exceed total quantity';
    }
    if (totalShelfQuantity !== 0 && totalShelfQuantity < item.quantityToAdd) {
      errors.inventoryItems = 'Total quantity should be equal to shelf quantities';
    }
    
  });
  return errors;
}
  
  const handleSubmit = async () => {
    try {
      await StoreInventoryManagementValidation.validate(storeInventory, {
        abortEarly: false,
      })
      setErrors({});

      const validationErrors = validateInventoryItems();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      await updateStore()
      // dispatch(resetStoreInventory());
      // dispatch(fetchBillingLeanItems())
    } catch (error) {
      setErrors(getYupValidationErrorMap(error));
    }
  };

  const isSmallScreen = useMediaQuery('(max-width: 768px)'); 

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

        <Grid.Col span={12}>
          <ItemSearch
            onItemSelect={handleItemSelect}
            isApprovedPO={undefined}
            error={errors.inventoryItems}
          />
        </Grid.Col>

        <Grid.Col span={isSmallScreen ? 12 : 4} sx={{ textAlign: 'left' }}>
          <StoreSelect
            stores={stores}
            value={selectedStoreId}
            onChange={handleStoreChange}
            error={errors.selectedStoreId}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          {inventoryItems.length > 0 && (
            <InventoryItemPanel
              items={inventoryItems}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
            />
          )}
        </Grid.Col>

        <Grid.Col span={isSmallScreen ? 12 : 4}>
          <Button loading={loading} w="100%" onClick={handleSubmit}>
            Transfer Inventory
          </Button>
        </Grid.Col>
      </Grid>
    </Flex>
  );
};

export default StoreInventoryManagement;