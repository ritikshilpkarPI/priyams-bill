import React, { useState, Fragment, MouseEvent, useEffect, useMemo } from 'react';
import {
  Table,
  ScrollArea,
  ActionIcon,
  NumberInput,
  Text,
  Tooltip,
  TextInput,
  Select,
  Button,
  Flex,
  Collapse,
  Code,
  Loader,
} from '@mantine/core';
import { IconCheck, IconX, IconPlus } from '@tabler/icons-react';
import dayjs from 'dayjs';

import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import {
  updateBatch,
  addBatch,
  setItems,
  setBoxIdToBatch,
  setDealerIdToBatch,
  removeBatch,
  updateItemsWithExpiryBatch,
  removeItemData,
} from '../redux/ExpiryBatch/expiryBatchSlice';
import { selectDealers } from 'src/redux/dealerlist/dealerSelectors';
import type { ExpiredItemTableProps } from 'src/types';

import classes from './ExpiredItemImageTable.module.css';

const fmt = (d: string | Date) => dayjs(d).format('DD MMM YYYY');

const generateBoxId = (): string => {
  const len = Math.floor(Math.random() * 3) + 6;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < len; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

export const ExpiredItemPOTable: React.FC<ExpiredItemTableProps> = ({
  items = [],
  expiryBatchData,
  setItemsData,
  id,
  isLoading,
}) => {
  const dispatch = useDispatch();
  const expiryBatchMap = useSelector((state: RootState) => state.expiryBatch.items);
  const dealerId = useSelector((state: RootState) => state.expiryBatch.dealerId);
  const dealerNameInExpiryBatch = useSelector(
    (state: RootState) => state.expiryBatch.dealerNameInExpiryBatch
  );
  const expiryBatchBoxId = useSelector((state: RootState) => state.expiryBatch.boxId);
  const dealers = useSelector(selectDealers);

  const [updatedRows, setUpdatedRows] = useState<Set<string>>(new Set());
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [editingBatches, setEditingBatches] = useState<Set<string>>(new Set());
  const [drafts, setDrafts] = useState<
    Record<
      string,
      {
        manufacturingDate: string;
        expiryDate: string;
        currentStock: number;
        costPrice: number;
      }
    >
  >({});
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null);
  const [addingItemId, setAddingItemId] = useState<string | null>(null);
  const [newBatchDraft, setNewBatchDraft] = useState<{
    purchaseOrderId: string;
    manufacturingDate: Date;
    expiryDate: Date;
    currentStock: number;
    costPrice: number;
  }>({
    purchaseOrderId: '',
    manufacturingDate: new Date(),
    expiryDate: new Date(),
    currentStock: 0,
    costPrice: 0,
  });
  const [boxId] = useState<string>(generateBoxId);
  const [isAddingNewBatch, setIsAddingNewBatch] = useState<boolean>(false);
  const [isRemovingItem, setIsRemovingItem] = useState<boolean>(false);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  /* === UPDATED === */
  // Moved to the top so it's always called in the same order
  const groupedItems = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const entry of items) {
      const id = entry._id;
      if (!map[id]) {
        map[id] = [];
      }
      map[id].push(entry);
    }
    return map;
  }, [items]);
  /* =============== */

  useEffect(() => {
    dispatch(setBoxIdToBatch({ boxId: boxId }));
  }, [boxId, dispatch]);

  const toggleItem = (itemId: string) =>
    setOpenItems((prev) => {
      const next = new Set(prev);
      next.has(itemId) ? next.delete(itemId) : next.add(itemId);
      return next;
    });

  const startEdit = (e: MouseEvent, itemId: string, batch: any) => {
    e.stopPropagation();
    setEditingBatches((prev) => new Set(prev).add(batch._id));

    const reduxItemExpiryBatches = expiryBatchMap[itemId] || [];
    const reduxItemExpiryBatchRecord = reduxItemExpiryBatches.find((b) => b.shelfId === batch._id);
    const purch = items
      .filter((it) => it._id === itemId)
      .find((it) =>
        it.purchaseData?.some((p: any) => p.purchaseOrderId === batch.purchaseOrderId)
      )?.purchaseData.find((p: any) => p.purchaseOrderId === batch.purchaseOrderId);

    const sourceData = reduxItemExpiryBatchRecord
      ? {
          ...reduxItemExpiryBatchRecord,
          manufacturingDate:
            typeof reduxItemExpiryBatchRecord.manufacturingDate === 'string'
              ? reduxItemExpiryBatchRecord.manufacturingDate
              : dayjs(reduxItemExpiryBatchRecord.manufacturingDate).toISOString(),
          expiryDate:
            typeof reduxItemExpiryBatchRecord.expiryDate === 'string'
              ? reduxItemExpiryBatchRecord.expiryDate
              : dayjs(reduxItemExpiryBatchRecord.expiryDate).toISOString(),
        }
      : {
          ...batch,
          manufacturingDate:
            typeof batch.manufacturingDate === 'string'
              ? batch.manufacturingDate
              : dayjs(batch.manufacturingDate).toISOString(),
          expiryDate:
            typeof batch.expiryDate === 'string'
              ? batch.expiryDate
              : dayjs(batch.expiryDate).toISOString(),
        };

    setDrafts((prev) => ({
      ...prev,
      [batch._id]: {
        manufacturingDate: sourceData.manufacturingDate,
        expiryDate: sourceData.expiryDate,
        currentStock: sourceData.currentStockQuantity,
        costPrice: sourceData.costPrice ?? purch?.costPrice ?? 0,
      },
    }));
  };

  const cancelEdit = (
    e: MouseEvent,
    batchId: string,
    itemId?: string,
    isDeleteAction?: boolean
  ) => {
    e.stopPropagation();

    if (isDeleteAction && itemId) {
      dispatch(
        removeBatch({
          itemId: itemId,
          shelfId: batchId,
        })
      );
    }

    if (isDeleteAction) {
      setUpdatedRows((prev) => {
        const next = new Set(prev);
        next.delete(batchId);
        return next;
      });
    }

    setEditingBatches((prev) => {
      const next = new Set(prev);
      next.delete(batchId);
      return next;
    });

    if (isDeleteAction) {
      setDrafts((prev) => {
        const { [batchId]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const saveEdit = (
    e: MouseEvent,
    itemId: string,
    shelfId: string,
    dealerName?: string,
    newDealerId?: string
  ) => {
    e.stopPropagation();
    const data = drafts[shelfId];
    if (!data) return;

    const allUnchecked = Object.values(expiryBatchMap).every((batches) =>
      batches.every((b) => !b.checked)
    );

    if (allUnchecked) {
      dispatch(setDealerIdToBatch({ dealerId: '', dealerName: '' }));
    }

    if (!allUnchecked && dealerId && newDealerId && dealerId !== newDealerId && newDealerId !== 'N/A') {
      window.alert('You cannot add a PO from a different dealer');
      return;
    }

    if (newDealerId && newDealerId !== 'N/A') {
      dispatch(setDealerIdToBatch({ dealerId: newDealerId, dealerName }));
    }

    dispatch(
      updateBatch({
        itemId,
        shelfId,
        fields: {
          manufacturingDate: data.manufacturingDate,
          expiryDate: data.expiryDate,
          quantity: data.currentStock,
          costPrice: data.costPrice,
          checked: true,
        },
      })
    );

    setUpdatedRows((prev) => new Set(prev).add(shelfId));
    setEditingBatches((prev) => {
      const next = new Set(prev);
      next.delete(shelfId);
      return next;
    });
  };

  const startAdd = (itemId: string) => {
    setAddingItemId(itemId);
    const today = dayjs().format('YYYY-MM-DD');
    setNewBatchDraft({
      purchaseOrderId: '',
      manufacturingDate: dayjs(today).toDate(),
      expiryDate: dayjs(today).add(1, 'year').toDate(),
      currentStock: 0,
      costPrice: 0,
    });
  };

  const cancelAdd = () => {
    setAddingItemId(null);
  };

  const saveAdd = (itemId: string) => {
    setIsAddingNewBatch(true);
    const shelfId = `${Date.now()}`;

    const item = items.find((i) => i._id === itemId);
    const purchase = item?.purchaseData?.find(
      (p) => p.purchaseOrderId === newBatchDraft.purchaseOrderId
    );

    const manufacturingDate = dayjs(newBatchDraft.manufacturingDate).isValid()
      ? dayjs(newBatchDraft.manufacturingDate).toISOString()
      : new Date().toISOString();
    const expiryDate = dayjs(newBatchDraft.expiryDate).isValid()
      ? dayjs(newBatchDraft.expiryDate).toISOString()
      : new Date().toISOString();
    const entryDate = new Date().toISOString();

    dispatch(
      addBatch({
        itemId,
        batch: {
          _id: shelfId,
          shelfId,
          purchaseOrderId: newBatchDraft.purchaseOrderId || '',
          entryDate,
          manufacturingDate,
          expiryDate,
          initialStockQuantity: newBatchDraft.currentStock,
          currentStockQuantity: newBatchDraft.currentStock,
          quantity: newBatchDraft.currentStock,
          costPrice: purchase?.costPrice || newBatchDraft.costPrice,
          checked: true,
        },
      })
    );

    if (purchase?.dealerId) {
      dispatch(
        setDealerIdToBatch({
          dealerId: purchase.dealerId._id,
          dealerName: purchase.dealerId.dealerName,
        })
      );
    }

    setUpdatedRows((prev) => new Set(prev).add(shelfId));
    setAddingItemId(null);
    setIsAddingNewBatch(false);
  };

  const handlePOIdChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const poId = e.currentTarget.value;
    setNewBatchDraft((d) => ({
      ...d,
      purchaseOrderId: poId,
    }));

    const item = items.find((i) => i._id === itemId);
    if (item) {
      const purchase = item.purchaseData?.find((p) => p.purchaseOrderId === poId);
      if (purchase?.dealerId) {
        dispatch(
          setDealerIdToBatch({
            dealerId: purchase.dealerId._id,
            dealerName: purchase.dealerId.dealerName,
          })
        );
      }
    }
  };

  useEffect(() => {
    if (items.length > 0) {
      dispatch(setItems({ items }));
    }
    if (expiryBatchData) {
      const transformedItems = expiryBatchData.map((item) => ({
        /* === UPDATED === */
        // Each batch gets a unique _id/shelfId instead of reusing itemId
        _id: item._id ?? `${item.itemId._id}-${Date.now()}`,
        shelfId: item._id ?? `${item.itemId._id}-${Date.now()}`,
        /* =============== */

        itemId: { _id: item.itemId._id },
        manufacturingDate: item.manufacturingDate
          ? dayjs(item.manufacturingDate).toISOString()
          : new Date().toISOString(),
        expiryDate: item.expiryDate,
        quantity: item.quantity,
        currentStockQuantity: item.quantity,
        checked: true,
        costPrice: item.costPricePerUnit,
        purchaseOrderId: item.purchaseOrderId?._id ?? '',
        entryDate: new Date().toISOString(),
        initialStockQuantity: item.quantity,
      }));
      dispatch(updateItemsWithExpiryBatch({ items: transformedItems }));
    }
  }, [items, expiryBatchData, dispatch]);

  if (!items.length) {
    return <Text>No items to display.</Text>;
  }

  const dealerOptions: { value: string; label: string }[] = dealers
    .filter((d): d is any => Boolean(d._id))
    .map((dealer) => ({
      value: dealer._id,
      label: dealer.dealerName,
    }));

  const onDealerSelect = (value: string | null) => {
    if (value) {
      dispatch(
        setDealerIdToBatch({
          dealerId: value,
          dealerName: dealers.find((dealer) => dealer._id === value)?.dealerName ?? '',
        })
      );
    } else {
      dispatch(setDealerIdToBatch({ dealerId: '', dealerName: '' }));
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setIsRemovingItem(true);
      setRemovingItemId(itemId);
      dispatch(removeItemData({ itemId }));

      setItemsData((items: any[]) => items.filter((item: any) => item._id !== itemId));
      setOpenItems((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    } finally {
      setIsRemovingItem(false);
      setRemovingItemId(null);
    }
  };

  return (
    <ScrollArea
      type="scroll"
      scrollbarSize={8}
      style={{ width: '100%', maxHeight: 600 }}
      className={classes.scrollArea}
    >
        <Flex justify="center" mb="md">
        {isLoading && (
          <Text size="sm" color="dimmed">
            <Loader size="sm" color="blue" />
          </Text>
        )}
      </Flex>
      <Flex py="lg" justify="center">
        <Text size="lg" weight={600}>
          Box ID:&nbsp;
          <Code
            sx={(theme) => ({
              fontSize: theme.fontSizes.xl,
              paddingInline: theme.spacing.sm,
              paddingBlock: theme.spacing.xs,
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            })}
          >
            {expiryBatchBoxId || boxId}
          </Code>
        </Text>
      </Flex>

      {/* Global Dealer Select */}
      <Flex justify="center" mb="md">
        <Select
          data={dealerOptions}
          placeholder="Select Dealer for Batch"
          searchable
          nothingFound="No dealers found"
          value={dealerId || dealerNameInExpiryBatch}
          onChange={onDealerSelect}
          disabled={
            Boolean(dealerId) &&
            Object.values(expiryBatchMap).some((batches) => batches.some((b) => b.checked))
          }
          style={{ width: 300 }}
        />
      </Flex>

      <div className={classes.tableContainer} role="table" aria-label="Expired Items">
        <div role="rowgroup">
          {Object.entries(groupedItems).map(([itemId, entries]) => {
            const isOpen = openItems.has(itemId);
            const firstEntry = entries[0];
            const { sku, itemBrandName, companyName } = firstEntry;

            const reduxItemExpiryBatches = expiryBatchMap[itemId] || [];
            const reduxMap = Object.fromEntries(
              reduxItemExpiryBatches.map((b: any) => [b.shelfId, b])
            );

            const allBatches: any[] = entries
              .map((entry) => {
                if (entry.itemShelfDates && entry.itemShelfDates.length > 0) {
                  return entry.itemShelfDates.map((shelf: any) => ({
                    _id: shelf._id,
                    purchaseOrderId: shelf.purchaseOrderId,
                    entryDate: shelf.entryDate,
                    manufacturingDate: shelf.manufacturingDate,
                    expiryDate: shelf.expiryDate,
                    initialStockQuantity: shelf.initialStockQuantity,
                    currentStockQuantity: shelf.currentStockQuantity,
                    checked: shelf.checked,
                    costPrice: shelf.costPrice,
                  }));
                }
                return [
                  {
                    _id: entry.shelfId ?? `${itemId}-${entry.purchaseOrderId || Date.now()}`,
                    purchaseOrderId: entry.purchaseOrderId,
                    entryDate: entry.entryDate,
                    manufacturingDate: entry.manufacturingDate,
                    expiryDate: entry.expiryDate,
                    initialStockQuantity: entry.initialStockQuantity,
                    currentStockQuantity: entry.currentStockQuantity,
                    checked: reduxMap[entry.shelfId ?? '']?.checked ?? false,
                    costPrice: entry.costPrice,
                  },
                ];
              })
              .flat();

            const mergedBatches = allBatches.map((batch) => {
              const reduxRec = reduxMap[batch._id];
              return reduxRec ? { ...batch, ...reduxRec } : batch;
            });
            reduxItemExpiryBatches.forEach((b: any) => {
              if (!mergedBatches.find((mb) => mb._id === b.shelfId)) {
                mergedBatches.push({
                  _id: b.shelfId,
                  purchaseOrderId: b.purchaseOrderId,
                  entryDate: b.entryDate,
                  manufacturingDate: b.manufacturingDate,
                  expiryDate: b.expiryDate,
                  initialStockQuantity: b.initialStockQuantity,
                  currentStockQuantity: b.quantity,
                  checked: b.checked,
                  costPrice: b.costPrice,
                });
              }
            });

            const findPurchase = (poId: string) =>
              entries[0].purchaseData?.find((p: any) => p.purchaseOrderId === poId);

            return (
              <Fragment key={itemId}>
                <div
                  className={`${classes.mainRow} ${isOpen ? classes.activeRow : ''}`}
                  onClick={() => toggleItem(itemId)}
                  role="row"
                  aria-expanded={isOpen}
                >
                  <div
                    className={`${classes.mainCell} ${classes.skuDetailCell}`}
                    role="cell"
                    style={{ gridColumn: 'sku-start / sku-end', gridRow: 1 }}
                  >
                    <Tooltip
                      label={`${sku} • ${itemBrandName} • ${companyName}`}
                      withArrow
                    >
                      <div className={classes.skuDetailsContainer}>
                        <div className={classes.ellipsis}>{`${sku}`}</div>
                        <div className={classes.brandName}>
                          {`${itemBrandName}`} . {`${companyName}`}
                        </div>
                        <Text
                          size="sm"
                          weight={500}
                          className={classes.viewDetailsLink}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleItem(itemId);
                          }}
                        >
                          View Item Details
                        </Text>
                      </div>
                    </Tooltip>
                  </div>
                  <div
                    className={`${classes.mainCell} ${classes.closeButtonCell}`}
                    role="cell"
                    style={{ gridColumn: 'close-start / close-end', gridRow: 1 }}
                  >
                    <ActionIcon
                      size="xl"
                      variant="subtle"
                      color="gray"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(itemId);
                      }}
                      className={classes.closeButtonIcon}
                      loading={isRemovingItem && removingItemId === itemId}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  </div>
                </div>

                {isOpen && (
                  <div className={classes.expandedContentRow} role="row">
                    <div className={classes.expandedContentCell} role="cell">
                      <Collapse in={isOpen} transitionDuration={300} transitionTimingFunction="ease-in-out">
                        <ScrollArea
                          type="always"
                          scrollbarSize={6}
                          style={{ width: '100%' }}
                          className={classes.nestedScrollArea}
                        >
                          <Table
                            withColumnBorders={false}
                            highlightOnHover={false}
                            className={classes.nestedTable}
                            verticalSpacing="xs"
                            horizontalSpacing="xs"
                          >
                            <thead>
                              <tr>
                                <th className={classes.nestedHeader}>PO ID</th>
                                <th className={classes.nestedHeader}>Dealer Name</th>
                                <th className={`${classes.nestedHeader} ${classes.nestedCellNumeric}`}>CP</th>
                                <th className={classes.nestedHeader}>MFG Date</th>
                                <th className={classes.nestedHeader}>Expiry Date</th>
                                <th className={`${classes.nestedHeader} ${classes.nestedCellNumeric}`}>Current</th>
                                <th className={classes.nestedHeader}>Draft Time</th>
                                <th className={classes.nestedHeader}>Approve Time</th>
                                <th className={classes.nestedHeader}>Actions</th>
                              </tr>
                            </thead>

                            <tbody>
                              {mergedBatches.map((batch) => {
                                const reduxItemExpiryRec = expiryBatchMap[itemId]?.find(
                                  (b: any) => b.shelfId === batch._id
                                );
                                const isEdit = editingBatches.has(batch._id);
                                const draft = drafts[batch._id];
                                const purch = findPurchase(batch.purchaseOrderId ?? '');

                                const mfg = isEdit
                                  ? draft?.manufacturingDate
                                  : reduxItemExpiryRec?.manufacturingDate || batch.manufacturingDate;
                                const exp = isEdit
                                  ? draft?.expiryDate
                                  : reduxItemExpiryRec?.expiryDate || batch.expiryDate;
                                const qty = isEdit
                                  ? draft?.currentStock
                                  : reduxItemExpiryRec?.quantity ?? batch.currentStockQuantity;
                                const checked = reduxItemExpiryRec?.checked;
                                const wasUpdated = updatedRows.has(batch._id);

                                const rowClass = `${classes.mainRow} ${classes.nestedRow} ${
                                  isEdit ? classes.activeRow : ''
                                } ${!isEdit && (checked || wasUpdated) ? classes.updatedRow : ''}`;

                                const dealerName = purch?.dealerId?.dealerName ?? 'N/A';

                                return (
                                  <tr
                                    key={batch._id}
                                    className={rowClass}
                                    onClick={(e) => !isEdit && startEdit(e, itemId, batch)}
                                  >
                                    <td
                                      className={
                                        batch.purchaseOrderId
                                          ? `${classes.nestedCell} ${classes.viewPoLink}`
                                          : classes.nestedCell
                                      }
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (batch.purchaseOrderId) {
                                          window.open(
                                            `/new-purchase-order/${batch.purchaseOrderId}`,
                                            '_blank',
                                            'noopener,noreferrer'
                                          );
                                        }
                                      }}
                                      style={{
                                        cursor: batch.purchaseOrderId ? 'pointer' : 'default',
                                      }}
                                    >
                                      {batch.purchaseOrderId ? 'View PO' : '-'}
                                    </td>
                                    <td className={classes.nestedCell}>
                                      {checked ? dealerNameInExpiryBatch : dealerName}
                                    </td>
                                    <td className={`${classes.nestedCell} ${classes.nestedCellNumeric}`}>
                                      {isEdit ? (
                                        <NumberInput
                                          size="xs"
                                          min={0}
                                          precision={2}
                                          value={draft?.costPrice}
                                          onClick={(e) => e.stopPropagation()}
                                          onChange={(v) =>
                                            setDrafts((p) => ({
                                              ...p,
                                              [batch._id]: {
                                                ...p[batch._id],
                                                costPrice: v ?? 0,
                                              },
                                            }))
                                          }
                                          className={classes.nestedInput}
                                          hideControls
                                        />
                                      ) : (
                                        (reduxItemExpiryRec?.costPrice ?? purch?.costPrice)?.toFixed(2) ?? '-'
                                      )}
                                    </td>
                                    <td className={classes.nestedCell}>
                                      {isEdit ? (
                                        <TextInput
                                          size="xs"
                                          type="date"
                                          value={dayjs(draft?.manufacturingDate).format('YYYY-MM-DD')}
                                          onClick={(e) => e.stopPropagation()}
                                          onChange={(e) =>
                                            setDrafts((p) => ({
                                              ...p,
                                              [batch._id]: {
                                                ...p[batch._id],
                                                manufacturingDate: dayjs(e.currentTarget.value).toISOString(),
                                              },
                                            }))
                                          }
                                          className={classes.nestedInput}
                                        />
                                      ) : mfg ? (
                                        fmt(mfg)
                                      ) : (
                                        '-'
                                      )}
                                    </td>
                                    <td className={classes.nestedCell}>
                                      {isEdit ? (
                                        <TextInput
                                          size="xs"
                                          type="date"
                                          value={dayjs(draft?.expiryDate).format('YYYY-MM-DD')}
                                          onClick={(e) => e.stopPropagation()}
                                          onChange={(e) =>
                                            setDrafts((p) => ({
                                              ...p,
                                              [batch._id]: {
                                                ...p[batch._id],
                                                expiryDate: dayjs(e.currentTarget.value).toISOString(),
                                              },
                                            }))
                                          }
                                          className={classes.nestedInput}
                                        />
                                      ) : exp ? (
                                        fmt(exp)
                                      ) : (
                                        '-'
                                      )}
                                    </td>
                                    <td className={`${classes.nestedCell} ${classes.nestedCellNumeric}`}>
                                      {isEdit ? (
                                        <NumberInput
                                          size="xs"
                                          min={0}
                                          value={draft?.currentStock}
                                          onClick={(e) => e.stopPropagation()}
                                          onChange={(v) =>
                                            setDrafts((p) => ({
                                              ...p,
                                              [batch._id]: {
                                                ...p[batch._id],
                                                currentStock: v ?? 0,
                                              },
                                            }))
                                          }
                                          hideControls
                                          className={classes.nestedInput}
                                        />
                                      ) : (
                                        reduxItemExpiryRec?.quantity ?? batch.currentStockQuantity ?? '-'
                                      )}
                                    </td>
                                    <td className={classes.nestedCell}>
                                      {purch?.draftTime ? fmt(purch.draftTime) : '-'}
                                    </td>
                                    <td className={classes.nestedCell}>
                                      {purch?.approveTime ? fmt(purch.approveTime) : '-'}
                                    </td>
                                    <td className={classes.nestedActionCell}>
                                      {isEdit && (
                                        <>
                                          <ActionIcon
                                            color="green"
                                            variant="filled"
                                            onClick={(e) =>
                                              saveEdit(
                                                e,
                                                itemId,
                                                batch._id,
                                                purch?.dealerId?.dealerName,
                                                purch?.dealerId?._id
                                              )
                                            }
                                            title="Save"
                                            loading={isAddingNewBatch}
                                          >
                                            <IconCheck />
                                          </ActionIcon>
                                          <ActionIcon
                                            color="red"
                                            variant="filled"
                                            onClick={(e) => cancelEdit(e, batch._id, itemId, false)}
                                            title="Delete"
                                          >
                                            <IconX />
                                          </ActionIcon>
                                        </>
                                      )}
                                      {!isEdit && (
                                        <>
                                          <ActionIcon
                                            size="sm"
                                            variant="subtle"
                                            color="gray"
                                            onClick={(e) => startEdit(e, itemId, batch)}
                                            title="Edit"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              width="16"
                                              height="16"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            >
                                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                          </ActionIcon>
                                          <ActionIcon
                                            size="sm"
                                            variant="subtle"
                                            color="red"
                                            onClick={(e) => cancelEdit(e, batch._id, itemId, true)}
                                            title="Delete"
                                          >
                                            <IconX size={16} />
                                          </ActionIcon>
                                        </>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}

                              {addingItemId === itemId && (
                                <tr className={`${classes.mainRow} ${classes.nestedRow} ${classes.updatedRow}`}>
                                  <td className={classes.nestedCell}>
                                    <TextInput
                                      size="xs"
                                      placeholder="PO ID"
                                      value={newBatchDraft.purchaseOrderId}
                                      onChange={(e) => handlePOIdChange(e, itemId)}
                                      className={classes.nestedInput}
                                    />
                                  </td>
                                  <td className={classes.nestedCell}>
                                    <Select
                                      data={dealerOptions}
                                      placeholder="Choose a dealer"
                                      searchable
                                      nothingFound="No dealers found"
                                      value={dealerId || dealerNameInExpiryBatch}
                                      onChange={onDealerSelect}
                                      disabled={Boolean(dealerNameInExpiryBatch)}
                                      className={classes.nestedSelect}
                                    />
                                  </td>
                                  <td className={`${classes.nestedCell} ${classes.nestedCellNumeric}`}>
                                    <NumberInput
                                      size="xs"
                                      min={0}
                                      precision={2}
                                      value={newBatchDraft.costPrice}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(v) =>
                                        setNewBatchDraft((d) => ({
                                          ...d,
                                          costPrice: v ?? 0,
                                        }))
                                      }
                                      hideControls
                                      className={classes.nestedInput}
                                    />
                                  </td>
                                  <td className={classes.nestedCell}>
                                    <TextInput
                                      size="xs"
                                      type="date"
                                      value={dayjs(newBatchDraft.manufacturingDate).format('YYYY-MM-DD')}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) =>
                                        setNewBatchDraft((d) => ({
                                          ...d,
                                          manufacturingDate: dayjs(e.currentTarget.value).toDate(),
                                        }))
                                      }
                                      className={classes.nestedInput}
                                    />
                                  </td>
                                  <td className={classes.nestedCell}>
                                    <TextInput
                                      size="xs"
                                      type="date"
                                      value={dayjs(newBatchDraft.expiryDate).format('YYYY-MM-DD')}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(e) =>
                                        setNewBatchDraft((d) => ({
                                          ...d,
                                          expiryDate: dayjs(e.currentTarget.value).toDate(),
                                        }))
                                      }
                                      className={classes.nestedInput}
                                    />
                                  </td>
                                  <td className={`${classes.nestedCell} ${classes.nestedCellNumeric}`}>
                                    <NumberInput
                                      size="xs"
                                      min={0}
                                      value={newBatchDraft.currentStock}
                                      onClick={(e) => e.stopPropagation()}
                                      onChange={(v) =>
                                        setNewBatchDraft((d) => ({
                                          ...d,
                                          currentStock: v ?? 0,
                                        }))
                                      }
                                      hideControls
                                      className={classes.nestedInput}
                                    />
                                  </td>
                                  <td className={classes.nestedActionCell}>
                                    <ActionIcon
                                      color="green"
                                      variant="filled"
                                      onClick={() => saveAdd(itemId)}
                                      title="Save"
                                      loading={isAddingNewBatch && addingItemId === itemId}
                                    >
                                      <IconCheck />
                                    </ActionIcon>
                                    <ActionIcon color="red" variant="filled" onClick={cancelAdd} title="Cancel">
                                      <IconX />
                                    </ActionIcon>
                                  </td>
                                </tr>
                              )}

                              {isOpen && !addingItemId && (
                                <tr className={classes.nestedRow}>
                                  <td className={classes.nestedCell} colSpan={7}>
                                    <Button
                                      size="xs"
                                      variant="outline"
                                      leftIcon={<IconPlus size={14} />}
                                      onClick={() => startAdd(itemId)}
                                      className={classes.addExpiryButton}
                                    >
                                      Add expiry
                                    </Button>
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </ScrollArea>
                      </Collapse>
                    </div>
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
};

