import React from 'react';
import { Table, ActionIcon, ScrollArea, Text } from '@mantine/core';
import CustomNumberInput from './customNumberInput/CustomNumberInput';
import { IconTrash } from '@tabler/icons-react';


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
            <th>Current Stock</th>
            <th>Expiry Batches (Qty to Add)</th>
            <th>Total Qty to Add</th>
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
                  {shelfList.length > 0 ? (
                    <Table withBorder withColumnBorders>
                      <thead>
                        <tr>
                          <th>Expiry</th>
                          <th>Manufacturing</th>
                          <th>Stock</th>
                          <th>Qty to Add</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shelfList.map((shelf) => (
                          <tr key={shelf._id}>
                            <td>{formatDate(shelf.expiryDate)}</td>
                            <td>{formatDate(shelf.manufacturingDate)}</td>
                            <td>{shelf.quantity}</td>
                            <td>
                              <CustomNumberInput
                                required
                                placeholder="Enter qty"
                                value={shelf.quantityToAdd ?? 0}
                                onChange={(e) =>
                                  handleQuantityChange(
                                    itemDetail._id,
                                    shelf.quantity,
                                    Number(e.target.value),
                                    shelf._id 
                                  )
                                }
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <Text size="sm">No expiry batches</Text>
                  )}
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
