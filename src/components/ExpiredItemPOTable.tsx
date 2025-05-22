import React, { useState, Fragment, MouseEvent, useEffect } from 'react';
import {
  Table,
  ScrollArea,
  ActionIcon,
  NumberInput,
  Text,
  Tooltip,
  createStyles,
  TextInput,
  Chip,
  Center,
  Code,
  Button,
  Flex,
  Select,
} from '@mantine/core';
import {
  IconChevronDown,
  IconChevronUp,
  IconCheck,
  IconX,
  IconPlus,
} from '@tabler/icons-react';
import dayjs from 'dayjs';

import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { updateBatch, addBatch, setItems, setBoxIdToBatch, setDealerIdToBatch, removeBatch, updateItemsWithExpiryBatch } from '../redux/ExpiryBatch/expiryBatchSlice';
import { selectDealers } from 'src/redux/dealerlist/dealerSelectors';
import { ExpiredItemTableProps } from 'src/types';

export const useStyles = createStyles((theme) => ({
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    tableLayout: 'fixed',
  },
  header: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    fontWeight: 600,
    fontSize: theme.fontSizes.sm,
    textTransform: 'uppercase',
    color:
      theme.colorScheme === 'dark' ? theme.colors.gray[3] : theme.black,
    padding: '4px 8px',
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark'
        ? theme.colors.dark[4]
        : theme.colors.gray[3]
    }`,
    textAlign: 'left',
  },
  cell: {
    padding: '4px 8px',
    verticalAlign: 'middle',
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark'
        ? theme.colors.dark[4]
        : theme.colors.gray[3]
    }`,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  numeric: { textAlign: 'right' },
  actionCell: {
    width: 80,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  colInfo: { width: '460px' },
  colSm: { width: '160px' },
  colMd: { width: '220px' },
  colSmArrow: { width: '80px' },
  skuCol: {width: '50vw'},
  row: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors.dark[5], 0.4)
          : theme.colors.gray[1],
    },
  },
  activeRow: {
    backgroundColor: theme.fn.rgba(
      theme.colors.blue[theme.colorScheme === 'dark' ? 8 : 2],
      0.2
    ),
  },
  updatedRow: {
    backgroundColor: theme.fn.rgba(
      theme.colors.green[theme.colorScheme === 'dark' ? 8 : 2],
      0.5
    ),
  },
  input: {
    maxWidth: '120px',
    fontSize: theme.fontSizes.sm,
  },
  ellipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}));

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


export const ExpiredItemPOTable: React.FC<ExpiredItemTableProps> = ({ items = [], expiryBatchData }) => {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch();
  const expiryBatchMap = useSelector(
    (state: RootState) => state.expiryBatch.items
  );
  const dealerId = useSelector(
    (state: RootState) => state.expiryBatch.dealerId
  );
  const dealerNameInExpiryBatch = useSelector(
    (state: RootState) => state.expiryBatch.dealerNameInExpiryBatch
  );

    const dealers = useSelector(selectDealers);    
  

  const [updatedRows, setUpdatedRows] = useState<Set<string>>(new Set());
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [editingBatches, setEditingBatches] = useState<Set<string>>(new Set());
  const [drafts, setDrafts] = useState<
    Record<
      string,
      {
        manufacturingDate: Date;
        expiryDate: Date;
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

  useEffect(() => {
    dispatch(setBoxIdToBatch({boxId: boxId}));
  }, [boxId, dispatch]);

  const toggleItem = (itemId: string) =>
    setOpenItems((prev) => {
      const next = new Set(prev);
      next.has(itemId) ? next.delete(itemId) : next.add(itemId);
      return next;
    });

  const startEdit = (
    e: MouseEvent,
    itemId: string,
    batch: Shelf
  ) => {
    e.stopPropagation();
    setEditingBatches((prev) => new Set(prev).add(batch._id));

    const reduxItemExpiryBatches = expiryBatchMap[itemId] || [];
    const reduxRec = reduxItemExpiryBatches?.find((b) => b.shelfId === batch._id);
    const purch = items
      ?.find((item) => item._id === itemId)
      ?.purchaseData?.find((purchaseOrder) => purchaseOrder.purchaseOrderId === batch.purchaseOrderId);
      

    setDrafts((prev) => ({
      ...prev,
      [batch._id]: {
        manufacturingDate:
          reduxRec?.manufacturingDate ?? new Date(batch?.manufacturingDate),
        expiryDate:
          reduxRec?.expiryDate ?? new Date(batch.expiryDate),
        currentStock:
          reduxRec?.quantity ?? batch.currentStockQuantity,
        costPrice: reduxRec?.costPrice ?? purch?.costPrice ?? 0,
      },
    }));
  };

  const cancelEdit = (e: MouseEvent, batchId: string, itemId?: string) => {
    e.stopPropagation();

    dispatch(removeBatch({
      itemId: itemId ?? '', 
      shelfId: batchId,
    }));

    setUpdatedRows(prev => {
      const next = new Set(prev);
      next.delete(batchId);
      return next;
    });
    
    setEditingBatches((prev) => {
      const next = new Set(prev);
      next.delete(batchId);
      return next;
    });
    setDrafts((prev) => {
      const { [batchId]: _, ...rest } = prev;
      return rest;
    });
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
   

    const allUnchecked = Object.values(expiryBatchMap).every(batches => {
      return batches.every(b => !b.checked);
    });     
    
    allUnchecked && dispatch(setDealerIdToBatch({ dealerId: '', dealerName: '' }));

    
    if (!allUnchecked && dealerId && newDealerId && dealerId !== newDealerId) {
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
          expiryDate: data?.expiryDate,
          quantity: data.currentStock,
          costPrice: data.costPrice,
          checked: true,
        },
      })
    );

    setUpdatedRows((prev) => new Set(prev).add(shelfId));
    cancelEdit(e, shelfId);
  };

  const startAdd = (itemId: string) => {
    setAddingItemId(itemId);
    setNewBatchDraft({
      purchaseOrderId: '',
      manufacturingDate: new Date(),
      expiryDate: new Date(),
      currentStock: 0,
      costPrice: 0,
    });
  };

  const cancelAdd = () => {
    setAddingItemId(null);
  };

  const saveAdd = (itemId: string) => {
    const shelfId = `${Date.now()}`;
    dispatch(
      addBatch({
        itemId,
        batch: {
          _id: shelfId,
          shelfId,
          purchaseOrderId: newBatchDraft.purchaseOrderId,
          entryDate: new Date().toISOString(),
          manufacturingDate: newBatchDraft.manufacturingDate.toISOString(),
          expiryDate: newBatchDraft.expiryDate.toISOString(),
          initialStockQuantity: newBatchDraft.currentStock,
          currentStockQuantity: newBatchDraft.currentStock,
          costPrice: newBatchDraft.costPrice,
          checked: true,
        },
      })
    );
    setUpdatedRows((prev) => new Set(prev).add(shelfId));
    setAddingItemId(null);
  };

  useEffect(() => {
    if (items.length > 0) {
     dispatch(setItems({ items }));
    }
    
    if (expiryBatchData) {
      const itemWiseTotalCost: {
        itemId: {
          _id: string;
        };
        totalCostPrice: number;
      }[] = [];
      let expiryBatchCost = 0;

      for (const item of expiryBatchData) {
        const totalCostPrice = item.costPricePerUnit * item.quantity;
        expiryBatchCost += totalCostPrice;

        itemWiseTotalCost.push({
          itemId: item.itemId,
          totalCostPrice,
        });
      }      
      dispatch(updateItemsWithExpiryBatch({ items: expiryBatchData}));
    }
 },[items, dispatch]);

  if (!items.length) {
    return <Text>No items to display.</Text>;
  }  

  const dealerOptions: { value: string; label: string }[] = dealers
  .filter((d): d is Dealer & { _id: string } => Boolean(d._id))
  .map((dealer) => ({
    value: dealer._id,
    label: dealer.dealerName,
  }));

    const onDealerSelect = (value: string | null) => {
      setSelectedDealer(value);
      if (value) {
        dispatch(setDealerIdToBatch({dealerId: value, dealerName: dealers.find((dealer) => dealer._id === value)?.dealerName}));
      } 
    } 
  
  return (
    <ScrollArea
      type="scroll"
      scrollbarSize={8}
      style={{ width: '100%', maxHeight: 600 }}
    >
      <Flex py="lg">
        <Text size="lg" weight={600} align="center">
          Box ID:&nbsp;<Code 
          sx={(theme) => ({
            fontSize: theme.fontSizes.xl,
            paddingInline: theme.spacing.sm,
            paddingBlock: theme.spacing.xs,
          })}
          >{boxId}</Code>
        </Text>
      </Flex>

      
       <ScrollArea
                          type="always"
                          scrollbarSize={6}
                          style={{ height: 300, width: '100%' }}
      >

      <Table
        withBorder
        withColumnBorders
        highlightOnHover={false}
        className={classes.table}
        verticalSpacing="sm"
        horizontalSpacing="md"
        
      >

        <tbody>
          {items.map((item) => {
            const isOpen = openItems.has(item._id);
            const reduxItemExpiryBatches = expiryBatchMap[item._id] || [];
            const reduxItemExpiryBatchesMap = Object.fromEntries(
              reduxItemExpiryBatches.map((b) => [b.shelfId, b])
            );
            const additionalBatches = reduxItemExpiryBatches
  .filter((b) => !item.itemShelfDates.some((s) => s._id === b.shelfId))
  .map((itemExpiryBatch) => ({
    _id: itemExpiryBatch.shelfId,
    purchaseOrderId: itemExpiryBatch.purchaseOrderId,
    entryDate: itemExpiryBatch.entryDate,
    manufacturingDate: itemExpiryBatch?.manufacturingDate,
    expiryDate: itemExpiryBatch?.expiryDate,
    initialStockQuantity: itemExpiryBatch.initialStockQuantity,
    currentStockQuantity: itemExpiryBatch.quantity,
    checked: itemExpiryBatch.checked,
    costPrice: itemExpiryBatch.costPrice,
  }));
            const findPurchase = (poId: string) =>
              item.purchaseData?.find((p) => p.purchaseOrderId === poId);
            

            return (
              <Fragment key={item._id}>
                <tr className={classes.row}>
                  <td className={classes.colSmArrow}>
                    <ActionIcon
                      variant="transparent"
                      size="sm"
                      onClick={() => toggleItem(item._id)}
                    >
                      {isOpen ? <IconChevronUp /> : <IconChevronDown />}
                    </ActionIcon>
                  </td>
                  <td className={`${classes.cell} ${classes.colInfo}`}>
                    <Tooltip
                      label={`${item.sku} • ${item.itemBrandName} • ${item.companyName}`}
                      withArrow
                    >
                      <div>
                        <span>{item.sku}</span>
                      </div>
                     
                    </Tooltip>
                  </td>
                  <td className={classes.colInfo}>
                  {item.itemBrandName && <Chip
                        size="xs"
                        color="blue"
                        variant="filled"
                        checked
                        style={{ marginLeft: 8 }}
                      >
                        {item.itemBrandName}
                        </Chip>}
                      { item.companyName && <Chip
                      size="xs"
                      color="blue"
                      variant="filled"
                      checked
                      style={{ marginLeft: 8 }}
                    >
                      {item.companyName}
                    </Chip>}
                        </td>
                
                  
                  <td className={classes.cell} colSpan={7} />
                </tr>

                {isOpen && (
                  <Fragment>
                    <tr>
                      <td colSpan={9} style={{ padding: 0 }}>
                        <Center mb="xs">
                          <Button
                            size="xs"
                            variant="outline"
                            leftIcon={<IconPlus size={14} />}
                            onClick={() => startAdd(item._id)}
                          >
                            Add expiry
                          </Button>
                        </Center>

                        <ScrollArea
                          type="always"
                          scrollbarSize={6}
                          style={{ width: '100%' }}
                        >
                          <Table
                            withColumnBorders
                            highlightOnHover={false}
                            className={classes.table}
                            verticalSpacing="sm"
                            horizontalSpacing="xs"
                          >
                            <thead>
                              <tr>
                                <th className={classes.header}>View PO</th>
                                <th className={classes.header}>Dealer Name</th>
                                <th className={`${classes.header} ${classes.numeric}`}>
                                  CP
                                </th>
                                
                                <th className={classes.header}>MFG Date</th>
                                <th className={classes.header}>Expiry Date</th>
                               
                                <th className={`${classes.header} ${classes.numeric}`}>
                                  Current
                                </th>
                                <th className={classes.header}>Actions</th>
                              </tr>
                            </thead>

                            <tbody>
                              {addingItemId === item._id && (
                                <tr className={cx(classes.row, classes.updatedRow)}>
                                  <td className={classes.cell}>
                                    <TextInput
                                      size="xs"
                                      placeholder="PO ID"
                                      value={newBatchDraft.purchaseOrderId}
                                      onChange={(e) =>
                                        setNewBatchDraft((d) => ({
                                          ...d,
                                          purchaseOrderId: e.currentTarget.value,
                                        }))
                                      }
                                    />
                                  </td>
                                  <td className={classes.cell}>
                                  <Select
                                                 data={dealerOptions}
                                                 placeholder="Choose a dealer"
                                                 searchable
                                                 nothingFound="No dealers found"
                                                 value={ dealerId || dealerNameInExpiryBatch}
                                                 onChange={onDealerSelect}
                                                 disabled={Boolean(dealerNameInExpiryBatch)}
                                               />
                                  </td>
                                 
                                  <td className={`${classes.cell} ${classes.numeric}`}>
                                    <NumberInput
                                      size="xs"
                                      min={0}
                                      precision={2}
                                      value={newBatchDraft.costPrice}
                                      onChange={(v) =>
                                        setNewBatchDraft((d) => ({
                                          ...d,
                                          costPrice: v ?? 0,
                                        }))
                                      }
                                      hideControls
                                      className={classes.input}
                                    />
                                  </td>
                                 
                                 
                                  <td className={classes.cell}>
                                    <TextInput
                                      size="xs"
                                      type="date"
                                      value={dayjs(newBatchDraft.manufacturingDate).format(
                                        'YYYY-MM-DD'
                                      )}
                                      onChange={(e) =>
                                        setNewBatchDraft((d) => ({
                                          ...d,
                                          manufacturingDate: dayjs(
                                            e.currentTarget.value,
                                            'YYYY-MM-DD'
                                          ).toDate(),
                                        }))
                                      }
                                      className={classes.input}
                                    />
                                  </td>
                                  <td className={classes.cell}>
                                    <TextInput
                                      size="xs"
                                      type="date"
                                      value={dayjs(newBatchDraft?.expiryDate).format(
                                        'YYYY-MM-DD'
                                      )}
                                      onChange={(e) =>
                                        setNewBatchDraft((d) => ({
                                          ...d,
                                          expiryDate: dayjs(
                                            e.currentTarget.value,
                                            'YYYY-MM-DD'
                                          ).toDate(),
                                        }))
                                      }
                                      className={classes.input}
                                    />
                                  </td>
                                  <td className={`${classes.cell} ${classes.numeric}`}>
                                    <NumberInput
                                      size="xs"
                                      min={0}
                                      value={newBatchDraft.currentStock}
                                      onChange={(v) =>
                                        setNewBatchDraft((d) => ({
                                          ...d,
                                          currentStock: v ?? 0,
                                        }))
                                      }
                                      hideControls
                                    />
                                  </td>
                                  
                                  <td className={classes.actionCell}>
                                    <ActionIcon
                                      color="green"
                                      variant="filled"
                                      onClick={() => saveAdd(item._id)}
                                      title="Save"
                                    >
                                      <IconCheck />
                                    </ActionIcon>
                                    <ActionIcon
                                      color="red"
                                      variant="filled"
                                      onClick={cancelAdd}
                                      title="Cancel"
                                    >
                                      <IconX />
                                    </ActionIcon>
                                  </td>
                                </tr>
                              )}

                              {[...item.itemShelfDates, ...additionalBatches].map((batch) => {
                                const reduxItemExpiryRec = reduxItemExpiryBatchesMap[batch._id];
                                const isEdit = editingBatches.has(batch._id);
                                const draft = drafts[batch._id];
                                const purch = findPurchase(batch.purchaseOrderId ?? '');

                                const mfg = isEdit
                                  ? draft?.manufacturingDate
                                  : reduxItemExpiryRec?.manufacturingDate ??
                                    new Date(batch?.manufacturingDate);
                                const exp = isEdit
                                  ? draft?.expiryDate
                                  : reduxItemExpiryRec?.expiryDate ??
                                    new Date(batch?.expiryDate);
                                const qty = isEdit
                                  ? draft?.currentStock
                                  : reduxItemExpiryRec?.quantity ??
                                    batch?.currentStockQuantity;
                                const checked = reduxItemExpiryRec?.checked;
                                const wasUpdated = updatedRows.has(batch._id);

                                const rowClass = cx(classes.row, {
                                  [classes.activeRow]: isEdit,
                                  [classes.updatedRow]:
                                    !isEdit && (checked || wasUpdated),
                                });
                                const dealerName =
                                  purch?.dealerId?.dealerName ?? 'N/A';

                                return (
                                  <tr
                                    key={batch._id}
                                    className={rowClass}
                                    onClick={(e) =>
                                      !isEdit && startEdit(e, item._id, batch as any)
                                    }
                                  >
                                    <td className={classes.cell}
                                    onClick={e => {
                                      e.stopPropagation();           
                                      window.open(
                                        `/new-purchase-order/${batch.purchaseOrderId}`,
                                        '_blank',
                                        'noopener,noreferrer'
                                      );
                                    }}
                                    >
                                      {batch.purchaseOrderId}
                                    </td>
                                   { !isEdit ?  <td className={classes.cell}>
                                      { checked ? dealerNameInExpiryBatch : dealerName}
                                    </td>
                                   : <>
                                     
                                      {  dealerName && dealerName !== 'N/A' ? dealerName : <Select
                                                 data={dealerOptions}
                                                 placeholder="Choose a dealer"
                                                 searchable
                                                 nothingFound="No dealers found"
                                                 value={ dealerId || dealerNameInExpiryBatch}
                                                 onChange={onDealerSelect}
                                                 disabled={Boolean(dealerNameInExpiryBatch)}
                                               />}
                                      
                                   </>  
                                  }
                                    
                                    <td className={`${classes.cell} ${classes.numeric}`}>
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
                                          className={classes.input}
                                          hideControls
                                        />
                                      ) : (
                                        (
                                          reduxItemExpiryRec?.costPrice ??
                                          purch?.costPrice
                                        )?.toFixed(2) ?? '-'
                                      )}
                                    </td>
                                    
                                    <td className={classes.cell}>
                                      {isEdit ? (
                                        <TextInput
                                          type="date"
                                          value={dayjs(mfg).format('YYYY-MM-DD')}
                                          onClick={(e) => e.stopPropagation()}
                                          onChange={(e) =>
                                            setDrafts((p) => ({
                                              ...p,
                                              [batch._id]: {
                                                ...p[batch._id],
                                                manufacturingDate: dayjs(
                                                  e.currentTarget.value,
                                                  'YYYY-MM-DD'
                                                ).toDate(),
                                              },
                                            }))
                                          }
                                          className={classes.input}
                                        />
                                      ) : (
                                        fmt(mfg)
                                      )}
                                    </td>
                                    <td className={classes.cell}>
                                      {isEdit ? (
                                        <TextInput
                                          type="date"
                                          value={dayjs(exp).format('YYYY-MM-DD')}
                                          onClick={(e) => e.stopPropagation()}
                                          onChange={(e) =>
                                            setDrafts((p) => ({
                                              ...p,
                                              [batch._id]: {
                                                ...p[batch._id],
                                                expiryDate: dayjs(
                                                  e.currentTarget.value,
                                                  'YYYY-MM-DD'
                                                ).toDate(),
                                              },
                                            }))
                                          }
                                          className={classes.input}
                                        />
                                      ) : (
                                        fmt(exp)
                                      )}
                                    </td>
                                    
                                    <td className={`${classes.cell} ${classes.numeric}`}>
                                      {isEdit ? (
                                        <NumberInput
                                          min={0}
                                          value={qty}
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
                                          className={classes.input}
                                          hideControls
                                        />
                                      ) : (
                                        qty
                                      )}
                                    </td>
                                    <td className={classes.actionCell}>
                                      {isEdit && (
                                        <>
                                          <ActionIcon
                                            color="green"
                                            variant="filled"
                                            onClick={(e) =>
                                              saveEdit(
                                                e,
                                                item._id,
                                                batch._id,
                                                purch?.dealerId?.dealerName,
                                                purch?.dealerId?._id
                                              )
                                            }
                                            title="Save"
                                          >
                                            <IconCheck />
                                          </ActionIcon>
                                          <ActionIcon
                                            color="red"
                                            variant="filled"
                                            onClick={(e) => cancelEdit(e, batch._id, item._id)}
                                            title="Cancel"
                                          >
                                            <IconX />
                                          </ActionIcon>
                                        </>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </ScrollArea>
                      </td>
                    </tr>
                  </Fragment>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </Table>
      </ScrollArea>
    </ScrollArea>
  );
};
