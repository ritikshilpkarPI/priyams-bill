import React from 'react';
import { Badge, Button, Flex, Group, Table, Text, Box } from '@mantine/core';
import { IconX, IconEdit, IconTrash } from '@tabler/icons-react';
import { ImageUploadComponent } from '../ImageUploadComponent/ImageUploadComponent';
import { ImagePreview } from '../ImagePreview/ImagePreview';
import { ShelfLifeInfo } from '../shelfLifeInfo/ShelfLifeInfo';
import { CloudImage } from 'src/types';

export interface ItemExpiryTableProps {
  expiryDates: ItemExpiryDateType[];
  onRemove: (idx: number) => void;
  showActions?: boolean;
  showTotal?: boolean;
  onEdit?: (idx: number) => void;
  onImagesChange?: (idx: number, files: File[]) => void;
  disabled?: boolean;
  images?: CloudImage[];
}

export const ItemExpiryTable = ({
  expiryDates,
  onRemove,
  showActions,
  showTotal,
  onEdit,
  onImagesChange,
  disabled = false,
  images = [],
}: ItemExpiryTableProps) => {
  const totalExpiryQuantity = expiryDates.reduce(
    (acc, expiryDate) => acc + Number(expiryDate.value || 0),
    0
  );

  const rows = expiryDates.map((expiryDate, idx) => {
    const mfgDate = new Date(expiryDate.mfgDate);
    const expDate = new Date(expiryDate.date);    

    return (
      <tr key={idx}>
        <td>{mfgDate.toLocaleDateString('en-GB')}</td>
        <td>{expDate.toLocaleDateString('en-GB')}</td>
        <td>{expiryDate.value}</td>
        <td style={{ whiteSpace: 'nowrap', minWidth: 250 }}>
          <ShelfLifeInfo expiryDate={expiryDate} />
        </td>
        <td>
          <Group spacing="xs">
            <ImagePreview
              images={expiryDate.images?.expiryImages || images}
              title={`Expiry Date ${idx + 1}`}
            />
            {onImagesChange && !disabled && (
              <Box>
                <Text size="xs" color="dimmed" mb={4}>
                  Upload Expiry Images {idx + 1}
                </Text>
                <ImageUploadComponent
                  onImagesChange={(files) => onImagesChange(idx, files)}
                  maxFiles={2}
                  maxSize={2 * 1024 * 1024}
                  acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp']}
                  initialImages={expiryDate.images?.expiryImages || images}
                  size={24}
                />
              </Box>
            )}
          </Group>
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
    <Table withColumnBorders striped withBorder>
      <thead>
        <tr>
          <th>Manufacturing Date</th>
          <th>Expiry Date</th>
          <th>Quantity</th>
          <th>Shelf Life</th>
          <th>Expiry Images</th>
          {showActions && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {rows}
        {showTotal && (
          <tr>
            <td colSpan={2}>
              <Text weight={500}>Total</Text>
            </td>
            <td>
              <Text weight={500}>{totalExpiryQuantity}</Text>
            </td>
            <td colSpan={showActions ? 3 : 2}></td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};
