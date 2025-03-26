
import React, { useState } from 'react';
import { Title, Button, Group, Paper } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { ItemSearch } from 'src/components/ItemSearch';
import { StoreSelect } from 'src/components/StoreSelect';
import { InventoryItemPanel } from 'src/components/InventoryItemPanel';


const StoreInventory: React.FC = () => {
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);

  const stores: Store[] = [
    { id: 'store1', name: 'Main Store' },
    { id: 'store2', name: 'Outlet Store' },
  ];

  const handleItemSelect = (item: any) => {
    if (inventoryItems.find(invItem => invItem.itemDetail._id === item.itemDetail._id)) {        
      showNotification({ message: 'Item already added', color: 'yellow' });
      return;
    }
    const newItem: StoreInventoryItem = { ...item, quantityToAdd: 1 };
    setInventoryItems([...inventoryItems, newItem]);
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setInventoryItems(
      inventoryItems.map((item) =>
        item.itemDetail._id === itemId ? { ...item, quantityToAdd: quantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setInventoryItems(inventoryItems.filter((item) => item._id !== itemId));
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
  };

  return (
    <Paper p="md" radius="md" withBorder style={{ margin: '16px' }}>
      <Title order={2} mb="md">Store Inventory Management</Title>
      <StoreSelect stores={stores} value={selectedStoreId} onChange={setSelectedStoreId} />
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

export default StoreInventory;
