import React from 'react';
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
} from 'src/redux/storeInventoryManagement/storeInventoryManagementSlice';

const StoreInventoryManagement: React.FC = () => {
  const dispatch = useDispatch();
  const selectedStoreId = useSelector(
    (state: RootState) => state.storeInventoryManagement.selectedStoreId
  );
  const inventoryItems = useSelector(
    (state: RootState) => state.storeInventoryManagement.inventoryItems
  );

  // For demonstration, a static list of stores is provided.
  const stores: Store[] = [
    { id: 'store1', name: 'Main Store' },
    { id: 'store2', name: 'Outlet Store' },
  ];

  const handleStoreChange = (storeId: string) => {
    dispatch(setSelectedStore(storeId));
  };

  const handleItemSelect = (item: any) => {
    // Check if item already exists in the inventory items
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
    // Build the form payload to submit
    const formData: StoreInventoryForm = {
      storeId: selectedStoreId,
      items: inventoryItems,
    };
    console.log('Submitting Store Inventory:', formData);
    showNotification({ message: 'Inventory updated successfully', color: 'green' });
    // Reset the form after submission
    dispatch(resetStoreInventory());
  };

  return (
    <Paper p="md" radius="md" withBorder style={{ margin: '16px' }}>
      <Title order={2} mb="md">
        Store Inventory Management
      </Title>
      <StoreSelect stores={stores} value={selectedStoreId} onChange={handleStoreChange} />
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
