import React from 'react';
import { Table, NumberInput, ActionIcon, Text, ScrollArea } from '@mantine/core';
import CustomNumberInput from './customNumberInput/CustomNumberInput';
import { IconTrash } from '@tabler/icons-react';
interface InventoryItemPanelProps {
  items: {
    itemDetail: {
      _id: string;
      itemName: string;
      itemBarcode: string;
      itemStockQuantity: number;
      itemQtyInStore: number;
    };
    quantityToAdd: number; 
  }[];
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export const InventoryItemPanel: React.FC<InventoryItemPanelProps> = ({ items, onQuantityChange, onRemoveItem }) => {
  const handleQuantityChange = (
    itemId: string,
    itemStockQuantity: number,
    quantity: string
  ) => {
    if (Number(quantity) > itemStockQuantity || Number(quantity) < 0) {
      console.warn('Quantity exceeds available stock!');
      return;
    }
    onQuantityChange(itemId, Number(quantity));
  };

  return (
    <ScrollArea style={{ width: '100%' }}>
      <Table striped highlightOnHover withBorder>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Barcode</th>
            <th>Qty WH</th>
            <th>Qty Store</th>
            <th>Quantity to Add</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ itemDetail, quantityToAdd }) => (
            <tr key={itemDetail._id}>
              <td>{itemDetail.itemName}</td>
              <td>{itemDetail.itemBarcode}</td>
              <td>{itemDetail.itemStockQuantity}</td>
              <td>
                <Text>{itemDetail?.itemQtyInStore}</Text>
              </td>
              <td>
                <CustomNumberInput
                  required
                  placeholder="Enter Total Payable Amount"
                  value={quantityToAdd}
                  onChange={(e) =>
                    handleQuantityChange(
                      itemDetail._id,
                      itemDetail.itemStockQuantity,
                      e.target.value
                    )
                  }
                />
              </td>
              <td>
                <ActionIcon
                  variant="filled"
                  color="red"
                  onClick={() => onRemoveItem(itemDetail._id)}
                >
                  <IconTrash size={18} />
                </ActionIcon>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </ScrollArea>
  );
};
