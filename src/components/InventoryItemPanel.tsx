import React from 'react';
import { Table, ActionIcon, ScrollArea, Text } from '@mantine/core';
import CustomNumberInput from './customNumberInput/CustomNumberInput';
import { IconTrash } from '@tabler/icons-react';
import ShelfTable from './shelfTable/ShelfTable';

interface InventoryItemPanelProps {
  items: {
    itemDetail: {
      itemShelfDates: never[];
      _id: string;
      itemName: string;
      itemBarcode: string;
      itemStockQuantity: number;
      itemShelfDate?: {
        expiryDates?: {
          date: string;
          mfgDate: string;
          value: number;
          isShelfExpired: boolean;
          _id: string;
        }[];
      };
      itemQtyInStore: number;
    };
    quantityToAdd: number; 
  }[];
  onQuantityChange: (itemId: string, quantity: number, shelfId?: string) => void;
  onRemoveItem: (itemId: string) => void;
}

export const InventoryItemPanel: React.FC<InventoryItemPanelProps> = ({
  items,
  onQuantityChange,
  onRemoveItem,
}) => {
  const handleQuantityChange = (
    itemId: string,
    maxStock: number,
    quantity: number,
    shelfId?: string
  ) => {
    if (quantity > maxStock || quantity < 0) {
      console.warn('Quantity exceeds available stock!');
      return;
    }
    onQuantityChange(itemId, quantity, shelfId);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString();

  return (
    <ScrollArea style={{ width: '100%' }}>
      <Table striped highlightOnHover withBorder>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Barcode</th>
            <th>Qty WH</th>
            <th>Qty Store</th>
            <th>Expiry Dates</th>
            <th>Manufacturing Dates</th>
            <th>Shelf Quantities</th>
            <th>Quantity to Add</th>
            <th>Expiry Batches (Qty to Add)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ itemDetail, quantityToAdd }) => {
            console.log({itemDetail});
            
            const shelfList = itemDetail.itemShelfDates || [];

            return (
              <tr key={itemDetail._id}>
                <td>{itemDetail.itemName}</td>
                <td>{itemDetail.itemBarcode}</td>
                <td>{itemDetail.itemStockQuantity}</td>
                <td>
                <Text>{itemDetail?.itemQtyInStore}</Text>
              </td>

                <td>
                <ShelfTable
                 shelfList={shelfList}
                 itemId={itemDetail._id}
                 handleQuantityChange={handleQuantityChange}
                   />
                </td>

                <td>
                  <CustomNumberInput
                    required
                    placeholder="Enter total qty"
                    value={quantityToAdd}
                    onChange={(e) =>
                      handleQuantityChange(
                        itemDetail._id,
                        itemDetail.itemStockQuantity,
                        Number(e.target.value)
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
            )
          })}
        </tbody>
      </Table>
    </ScrollArea>
  );
};
