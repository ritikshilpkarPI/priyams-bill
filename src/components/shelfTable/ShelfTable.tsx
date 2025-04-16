import React from 'react';
import { Table, Text } from '@mantine/core';
import CustomNumberInput from '../customNumberInput/CustomNumberInput';



const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString();

const ShelfTable: React.FC<ShelfTableProps> = ({ shelfList, itemId, handleQuantityChange }) => {
  if (!shelfList || shelfList.length === 0) {
    return <Text size="sm">No expiry batches</Text>;
  }

  return (
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleQuantityChange(
                    itemId,
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
  );
};

export default ShelfTable;
