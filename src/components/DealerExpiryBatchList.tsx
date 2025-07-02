import React, { useEffect, useState } from 'react';
import { Table, Loader, Text, Paper, Group, Badge, Button, Card, Box, Divider, ScrollArea, Tooltip, Stack } from '@mantine/core';
import { getAllExpiryItemsBatchAPI, addExpiryBatchToPOAPI } from 'src/utils/apiUtils';
import { IconPlus } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { DealerExpiryBatchListProps } from 'src/types';
import styles from './DealerExpiryBatchList.module.css';
import { useDispatch } from 'react-redux';
import { setPurchaseOrder } from 'src/redux/purchaseOrder/purchaseOrderSlice';

const DealerExpiryBatchList: React.FC<DealerExpiryBatchListProps> = ({ dealerId, purchaseOrderId, expiryBatches = [] }) => {
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [addingBatchId, setAddingBatchId] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!dealerId) return;
    setLoading(true);
    setError(null);
    getAllExpiryItemsBatchAPI({ dealerId, status: 'APPROVED' })
      .then((res) => {
        if (res?.isError || !res?.data) {
          setError('Failed to fetch expiry batches');
          setBatches([]);
        } else {
          setBatches(res.data);
        }
      })
      .catch(() => setError('Failed to fetch expiry batches'))
      .finally(() => setLoading(false));
  }, [dealerId]);

  const onAddToPO = async (batch: any) => {
    if (!purchaseOrderId) {
      toast.error('No purchase order selected');
      return;
    }
    setAddingBatchId(batch._id);
    const res = await addExpiryBatchToPOAPI(purchaseOrderId, batch._id);
    setAddingBatchId(null);
    if (res?.success) {
      toast.success('Expiry batch added to PO');
      if (res.order) {
        dispatch(setPurchaseOrder(res.order));
      }
    } else {
      toast.error(res?.message || 'Failed to add expiry batch to PO');
    }
  };

  if (!dealerId) {
    return <Text color="dimmed">No dealer selected.</Text>;
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  if (!batches.length) {
    return <Text color="dimmed">No expiry batches found for this dealer.</Text>;
  }

  return (
    <ScrollArea
      type="scroll"
      scrollbarSize={8}
      className={styles.scrollArea}
    >
      <Stack spacing="md">
        {batches.map((batch) => {
          const isAdded = expiryBatches?.some((poBatch: any) => poBatch?._id?.toString() === batch._id?.toString());
          return (
            <Card
              key={batch._id}
              shadow="md"
              radius="lg"
              withBorder
              className={isAdded ? `${styles.batchCard} ${styles.batchCardAdded}` : styles.batchCard}
            >
              <Group position="apart" align="flex-start" mb="xs">
                <Group className={styles.badgeGroup}>
                  <Badge color="blue" size="lg" variant="filled" radius="sm">
                    Box ID: {batch.boxId || '-'}
                  </Badge>
                  <Badge color="teal" variant="light">
                    {batch.createdAt ? new Date(batch.createdAt).toLocaleString() : '-'}
                  </Badge>
                  <Badge color={batch.status === 'APPROVED' ? 'green' : batch.status === 'DRAFTED' ? 'yellow' : 'gray'} variant="filled">
                    {batch.status}
                  </Badge>
                  <Badge color="grape" variant="light">
                    {batch.expiryBatchCost ? `₹${batch.expiryBatchCost.toFixed(2)}` : '-'}
                  </Badge>
                </Group>
                <Tooltip label={isAdded ? 'Already added to PO' : 'Add this expiry batch to PO'}>
                  <Button
                    leftIcon={<IconPlus size={18} />}
                    color={isAdded ? 'gray' : 'indigo'}
                    variant="gradient"
                    gradient={{ from: 'indigo', to: 'cyan' }}
                    size="sm"
                    radius="md"
                    onClick={() => onAddToPO(batch)}
                    style={{ minWidth: 140 }}
                    loading={addingBatchId === batch._id}
                    disabled={isAdded || !!addingBatchId}
                  >
                    {isAdded ? 'Added' : 'Add to PO'}
                  </Button>
                </Tooltip>
              </Group>
              <Divider my="sm" />
              <Box>
                <Text weight={500} size="sm" mb={6} color="dimmed">
                  Items in this batch:
                </Text>
                <Box className={styles.itemsFlexWrap}>
                  {(batch.items || []).map((item: any, idx: number) => (
                    <Card key={idx} shadow="xs" radius="sm" withBorder p="sm" className={styles.itemCard}>
                      <Text size="sm" weight={600} mb={2} color="dark">{item.itemId?.itemName || '-'}</Text>
                      <Text size="xs" color="dimmed" mb={2}>
                        Expiry: {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '-'}
                      </Text>
                      <Text size="xs">Qty: <b>{item.quantity}</b></Text>
                    </Card>
                  ))}
                </Box>
              </Box>
            </Card>
          );
        })}
      </Stack>
    </ScrollArea>
  );
};

export default DealerExpiryBatchList; 