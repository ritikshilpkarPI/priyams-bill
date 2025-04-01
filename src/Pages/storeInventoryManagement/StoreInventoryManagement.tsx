import React, { useEffect } from 'react';
import { Title, Button, Group, Paper } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store'; 
import { ItemSearch } from 'src/components/ItemSearch';
import { StoreSelect } from 'src/components/StoreSelect';
import { InventoryItemPanel } from 'src/components/InventoryItemPanel';
import {
  setSelectedStore,
  addInventoryItem,
  updateInventoryItemQuantity,
  removeInventoryItem,
  resetStoreInventory,
  setStores,
} from 'src/redux/storeInventoryManagement/storeInventoryManagementSlice';
import { getAllStoresAPI } from 'src/utils/apiUtils';

const StoreInventoryManagement: React.FC = () => {
  const dispatch = useDispatch();
  
  const stores = useSelector((state: RootState) => state.storeInventoryManagement.stores);
  const selectedStoreId = useSelector((state: RootState) => state.storeInventoryManagement.selectedStoreId);
  const inventoryItems = useSelector((state: RootState) => state.storeInventoryManagement.inventoryItems);

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

  const handleStoreChange = (storeId: string) => {
    dispatch(setSelectedStore(storeId));
  };

  const handleItemSelect = (item: any) => {
    if (inventoryItems.find((invItem) => invItem.itemDetail._id === item.itemDetail._id)) {
      showNotification({ message: 'Item already added', color: 'yellow' });
      return;
    }
    const newItem: StoreInventoryItem = { ...item, quantityToAdd: 1 };
    dispatch(addInventoryItem(newItem));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    dispatch(updateInventoryItemQuantity({ itemId, quantity }));
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeInventoryItem(itemId));
  };

  const handleSubmit = () => {
    if (!selectedStoreId) {
      showNotification({ message: 'Please select a store', color: 'red' });
      return;
    }
    if (inventoryItems.length === 0) {
      showNotification({ message: 'Please add at least one item', color: 'red' });
      return;
    }
    const formData: StoreInventoryForm = {
      storeId: selectedStoreId,
      items: inventoryItems,
    };
    console.log('Submitting Store Inventory:', formData);
    showNotification({ message: 'Inventory updated successfully', color: 'green' });
    dispatch(resetStoreInventory());
  };

  
  return (
    <Paper p="md" radius="md" withBorder style={{ margin: '16px' }}>
      <Title order={2} mb="md">Store Inventory Management</Title>
      <StoreSelect 
        stores={stores} 
        value={selectedStoreId} 
        onChange={handleStoreChange} 
      />
      <ItemSearch onItemSelect={handleItemSelect} isApprovedPO={undefined} />
      {inventoryItems.length > 0 && (
        <InventoryItemPanel
          items={inventoryItems}
          onQuantityChange={handleQuantityChange}
          onRemoveItem={handleRemoveItem}
        />
      )}
      <Group position="right" mt="md">
        <Button onClick={handleSubmit}>Transfer Inventory</Button>
      </Group>
    </Paper>
  );
};

export default StoreInventoryManagement;
