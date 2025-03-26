import { Table, NumberInput, ActionIcon, Text } from '@mantine/core';
// import { IconTrash } from '@tabler/icons';

interface InventoryItemPanelProps {
  items: any[];
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export const InventoryItemPanel: React.FC<InventoryItemPanelProps> = ({ items, onQuantityChange, onRemoveItem }) => {
    
  return (
    <Table striped highlightOnHover withBorder>
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Barcode</th>
          <th>Current Stock</th>
          <th>Quantity to Add</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.itemDetail._id}>
            <td>{item.itemDetail.itemName}</td>
            <td>{item.itemDetail.itemBarcode}</td>
            <td>{item.itemDetail.itemStockQuantity}</td>
            <td>
              <NumberInput
                value={item.quantityToAdd}
                onChange={(value) => onQuantityChange(item.itemDetail._id, value || 0)}
                min={1}
              />
            </td>
            <td>
              <ActionIcon color="red" onClick={() => onRemoveItem(item.itemDetail._id)}>
                {/* <IconTrash size={16} /> */} trash
              </ActionIcon>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
