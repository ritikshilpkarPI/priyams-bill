import React from 'react';
import { Badge, Button, Flex, Table } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { isShelfExpired } from 'src/utils/isShelfExpired';

export const ItemExpiryTable = ({
    expiryDates,
    onRemove,
    showActions,
    showTotal
}: ItemExpiryTableProps) => {
  const totalExpiryQuantity = expiryDates.reduce((acc, expiryDate) => acc + Number(expiryDate.value || 0), 0);
  const rows = expiryDates.map((expiryDate, idx) => (
        <tr key={idx}>
          <td>{new Date(expiryDate.mfgDate)?.toLocaleDateString('en-GB')}</td>
          <td>{new Date(expiryDate.date)?.toLocaleDateString('en-GB')}</td>
          <td>{expiryDate.value}</td>
          <td>
            {
              isShelfExpired(expiryDate.mfgDate, expiryDate.date)
              ? <Badge color="red">
              Shelf Expired
            </Badge>
              : "-"
            }
          </td>
            {
            showActions && (
              <td>
                <Button color="red" leftIcon={<IconX />} onClick={()=> onRemove(idx)}>
                    Remove
                </Button>
              </td>
            )
          }
        </tr>
  ));
  return (
    <Flex>
      <Table>
        <thead>
          <tr>
            <th>Mfg. Date.</th>
            <th>Exp. Date.</th>
            <th>Qty.</th>
            <th>Tags</th>
            { showActions && (<th>Action</th>) }
          </tr>
        </thead>
        <tbody>
            {rows}
            {
              showTotal && (<tr>
                <td>Total</td>
                <td>-</td>
                <td>{totalExpiryQuantity}</td>
                { showActions && (<td>-</td>) }
              </tr>)
            }
        </tbody>
     </Table>
    </Flex>
  )
}

