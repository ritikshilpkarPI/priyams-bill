import React from 'react';
import { Table, ActionIcon, ScrollArea, Text } from '@mantine/core';
import CustomNumberInput from './customNumberInput/CustomNumberInput';
import { IconTrash } from '@tabler/icons-react';

interface InventoryItemPanelProps {
  items: {
    itemDetail: {
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
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export const InventoryItemPanel: React.FC<InventoryItemPanelProps> = ({
  items,
  onQuantityChange,
  onRemoveItem,
}) => {
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(({ itemDetail, quantityToAdd }) => {
            const shelfList = itemDetail.itemShelfDate?.expiryDates || [];

            return (
              <tr key={itemDetail._id}>
                <td>{itemDetail.itemName}</td>
                <td>{itemDetail.itemBarcode}</td>
                <td>{itemDetail.itemStockQuantity}</td>
                <td>
                <Text>{itemDetail?.itemQtyInStore}</Text>
              </td>

                <td>
                  {shelfList.length > 0 ? (
                    shelfList.map((shelf) => (
                      <Text size="sm" key={shelf._id}>
                        {formatDate(shelf.date)}
                      </Text>
                    ))
                  ) : (
                    <Text size="sm">-</Text>
                  )}
                </td>

                <td>
                  {shelfList.length > 0 ? (
                    shelfList.map((shelf) => (
                      <Text size="sm" key={shelf._id}>
                        {formatDate(shelf.mfgDate)}
                      </Text>
                    ))
                  ) : (
                    <Text size="sm">-</Text>
                  )}
                </td>

                <td>
                  {shelfList.length > 0 ? (
                    shelfList.map((shelf) => (
                      <Text size="sm" key={shelf._id}>
                        {shelf.value}
                      </Text>
                    ))
                  ) : (
                    <Text size="sm">-</Text>
                  )}
                </td>

                <td>
                  <CustomNumberInput
                    required
                    placeholder="Enter quantity"
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
            )})}
        </tbody>
      </Table>
    </ScrollArea>
  );
};
