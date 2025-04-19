import React, { useState } from 'react';
import { Table, ActionIcon, ScrollArea, Text } from '@mantine/core';
import { IconTrash, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import ShelfTable from './shelfTable/ShelfTable';
import { useSelector } from 'react-redux';
import { CONSTANTS } from 'src/constants/constants';
import { pascalCase } from 'src/utils/pascalCase';

export const InventoryItemPanel: React.FC<InventoryItemPanelProps> = ({
  items,
  onQuantityChange,
  onRemoveItem,
}) => {
  const [collapsedIds, setCollapsedIds] = useState<string[]>([]);

  const toggleCollapse = (itemId: string) => {
    setCollapsedIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleQuantityChange = (
    itemId: string,
    maxStock: number,
    quantity: number,
    shelfId?: string
  ) => {
    if (quantity < 0) {
      console.warn('Quantity exceeds available stock!');
      return;
    }
    onQuantityChange(itemId, quantity, shelfId);
  };

  const transactionSource = useSelector(
    (state: RootState) => state.stockTransaction.source
  );

  const transactionDestination = useSelector(
    (state: RootState) => state.stockTransaction.destination
  );

  return (
    <ScrollArea style={{ width: '100%' }}>
      <Table striped highlightOnHover withBorder>
        <thead>
          <tr>
            <th></th>
            <th>SKU</th>
            <th>Barcode</th>
            <th>
              { `Qty ${pascalCase(transactionSource.sourceType ?? "")}`}
            </th>
            <th>
              {`Qty ${pascalCase(transactionDestination.destinationType ?? "" )}`}
            </th>
            <th>Expiry Batches (Qty to Add)</th>
            <th>Total Qty to Add</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isCollapsed = collapsedIds.includes(item.itemId);
            const sourceQuantity = item.itemByDate || [];

            return !isCollapsed ? (
              <tr key={item.itemId}>
                <td>
                  <ActionIcon onClick={() => toggleCollapse(item.itemId)}>
                    <IconChevronUp size={18} />
                  </ActionIcon>
                </td>
                <td>{item.sku}</td>
                <td>{item.itemBarcode}</td>
                <td>{item.itemStockQuantity}</td>
                <td>
                  <Text>{item?.itemQtyInStore}</Text>
                </td>
                <td>
                  <ShelfTable
                    shelfList={sourceQuantity}
                    itemId={item.itemId}
                    handleQuantityChange={handleQuantityChange}
                  />
                </td>
                <td>
                  <span>{item.totalQtyAdd}</span>
                </td>
                <td>
                  <ActionIcon
                    variant="filled"
                    color="red"
                    onClick={() => onRemoveItem(item.itemId)}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </td>
              </tr>
            ) : (
              <tr key={item.itemId}>
                <td>
                  <ActionIcon onClick={() => toggleCollapse(item.itemId)}>
                    <IconChevronDown size={18} />
                  </ActionIcon>
                </td>
                <td colSpan={7}>
                  <Text color="dimmed" italic>
                    {item.sku}
                  </Text>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </ScrollArea>
  );
};
