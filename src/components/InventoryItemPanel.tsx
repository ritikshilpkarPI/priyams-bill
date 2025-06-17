import React, { useState } from 'react';
import {
  Table,
  ActionIcon,
  ScrollArea,
  Text
} from '@mantine/core';
import {
  IconTrash,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react';
import ShelfTable from './shelfTable/ShelfTable';
import { useSelector } from 'react-redux';
import { CONSTANTS } from 'src/constants/constants';
import { pascalCase } from 'src/utils/pascalCase';
import DestinationShelfTable from './shelfTable/DestinationShelfTable';

export const InventoryItemPanel: React.FC<InventoryItemPanelProps> = ({
  items,
  onQuantityChange,
  onRemoveItem,
  enableDestinationForm,
  disabled = false,
  isSourceStaff = false,
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
    <ScrollArea style={{ width: '100%' , overflow: 'visible' }}>
      <Table striped highlightOnHover withBorder>
        <thead>
          <tr>
            <th></th>
            <th>SKU</th>
            {!enableDestinationForm && <> 
            <th>{`Qty ${pascalCase(transactionSource.sourceType ?? '')}`}</th>
            <th>{`Qty ${pascalCase(transactionDestination.destinationType ?? '')}`}</th>
            </>}
            <th>Expiry Batches (Qty to Add)</th>
           {!enableDestinationForm && <> <th>Total Qty to Add</th>
            <th>Action</th> </>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isCollapsed = collapsedIds.includes(item.itemId);
            const sourceQuantity = item.itemByDate || [];

            return !isCollapsed ? (
              <React.Fragment key={item.itemId}>
                <tr>
                  <td>
                    <ActionIcon
                      onClick={() => toggleCollapse(item.itemId)}
                      disabled={disabled}
                    >
                      <IconChevronUp size={18} />
                    </ActionIcon>
                  </td>
                  <td>{item.sku}</td>
                { !enableDestinationForm && <>
                  <td>{item.itemStockQuantity}</td>
                  <td>{item.itemQtyInStore}</td> </>}
                  <td>
                    {enableDestinationForm && !isSourceStaff ? (
                      <DestinationShelfTable
                        shelfList={sourceQuantity}
                        itemId={item.itemId}
                        disabled={disabled}
                      />
                    ) : (
                      <ShelfTable
                        showNewExpiryForm={true}
                        shelfList={sourceQuantity}
                        itemId={item.itemId}
                        handleQuantityChange={handleQuantityChange}
                      />
                    )}
                   
                  </td>
                { !enableDestinationForm && <>  <td>{item.totalQtyAdd}</td>
                  <td>
                  
                    <ActionIcon
                      variant="filled"
                      color="red"
                      onClick={() => onRemoveItem(item.itemId)}
                      disabled={disabled}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </td>
                  </>}
                </tr>
             
            

              </React.Fragment>
            ) : (
              <tr key={item.itemId}>
                <td>
                  <ActionIcon
                    onClick={() => toggleCollapse(item.itemId)}
                    disabled={disabled}
                  >
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
