import React from 'react';
import { Badge, Button, Flex, Group, Table, Text } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { isShelfExpired } from 'src/utils/isShelfExpired';
import { getShelfLifeInfo } from 'src/utils/calculateShelfLife';

export interface ItemExpiryTableProps {
  expiryDates: ItemExpiryDateType[];
  onRemove: (idx: number) => void;
  showActions?: boolean;
  showTotal?: boolean;
  onEdit?: (idx: number) => void;
}

export const ItemExpiryTable = ({
  expiryDates,
  onRemove,
  showActions,
  showTotal,
  onEdit,
}: ItemExpiryTableProps) => {
  const totalExpiryQuantity = expiryDates.reduce(
    (acc, expiryDate) => acc + Number(expiryDate.value || 0),
    0
  );

  const rows = expiryDates.map((expiryDate, idx) => {
    const mfgDate = new Date(expiryDate.mfgDate);
    const expDate = new Date(expiryDate.date);
    const shelfLife = getShelfLifeInfo(mfgDate, expDate);

    return (
      <tr key={idx}>
        <td>{mfgDate.toLocaleDateString('en-GB')}</td>
        <td>{expDate.toLocaleDateString('en-GB')}</td>
        <td>{expiryDate.value}</td>
        <td style={{ whiteSpace: 'nowrap', minWidth: 250 }}>
          <Flex direction="column" gap={4}>
            <Group spacing="xs" noWrap>
              <Text size="xs" weight={500} color="dimmed">Total:</Text>
              <Text size="xs" truncate>{shelfLife.totalShelfLife}</Text>
            </Group>
            <Group spacing="xs" noWrap>
              <Text size="xs" weight={500} color="dimmed">Left:</Text>
              <Text size="xs" truncate>{shelfLife.leftShelfLife}</Text>
            </Group>
            <Group spacing="xs" noWrap>
              <Text size="xs" weight={500} color="dimmed">% Left:</Text>
              <Badge size="xs" color="blue" variant="light">{shelfLife.percentShelfLifeLeft}</Badge>
            </Group>
          </Flex>
        </td>
        {showActions && (
          <td>
            <Group spacing="xs">
              {onEdit && (
                <Button onClick={() => onEdit(idx)} variant="outline" size="xs">
                  Edit
                </Button>
              )}
              <Button
                color="red"
                leftIcon={<IconX />}
                onClick={() => onRemove(idx)}
                size="xs"
              >
                Remove
              </Button>
            </Group>
          </td>
        )}
      </tr>
    );
  });

  return (
    <Flex
      sx={{
        border: '0.5px solid #D4D4D4',
        borderRadius: '4px',
        padding: '10px',
        overflowX: 'auto',
        width: '100%',
        maxWidth: '100%',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
      mt="8px"
    >
      <Table
        striped
        highlightOnHover
        verticalSpacing="sm"
        style={{ minWidth: '800px', width: '100%' }}
      >
        <thead>
          <tr>
            <th>Mfg. Date</th>
            <th>Exp. Date</th>
            <th>Qty.</th>
            <th style={{ minWidth: 250 }}>Shelf Life Info</th>
            {showActions && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {rows}
          {showTotal && (
            <tr>
              <td><strong>Total</strong></td>
              <td>-</td>
              <td>{totalExpiryQuantity}</td>
              <td colSpan={showActions ? 2 : 1}>—</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Flex>
  );
};
