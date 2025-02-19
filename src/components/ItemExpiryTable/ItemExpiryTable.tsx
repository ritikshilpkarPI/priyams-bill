import React from 'react';
import { Button, Table } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

export const ItemExpiryTable = ({
    expiryDates,
    onRemove
}: ItemExpiryTableProps) => {
  const totalExpiryQuantity = expiryDates.reduce((acc, expiryDate) => acc + Number(expiryDate.quantity), 0);
  const rows = expiryDates.map((expiryDate, idx) => (
        <tr key={idx}>
          <td>{expiryDate.mfgDate?.toLocaleDateString('en-GB')}</td>
          <td>{expiryDate.date?.toLocaleDateString('en-GB')}</td>
          <td>{expiryDate.quantity}</td>
          <td>
            <Button color="red" leftIcon={<IconX />} onClick={()=> onRemove(idx)}>
                Remove
            </Button>
          </td>
        </tr>
  ));
  return (
    <Table>
      <thead>
        <tr>
          <th>Manufacturing Date</th>
          <th>Expiry Date</th>
          <th>Quantity</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
          {rows}
          <tr>
            <td>Total</td>
            <td>-</td>
            <td>{totalExpiryQuantity}</td>
            <td>-</td>
          </tr>
      </tbody>
    </Table>
  )
}

