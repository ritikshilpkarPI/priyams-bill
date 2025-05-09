import React, { useState, Fragment, MouseEvent } from 'react';
import {
  Table,
  ScrollArea,
  ActionIcon,
  NumberInput,
  Text,
  Tooltip,
  createStyles,
  TextInput,
} from '@mantine/core';
import {
  IconChevronDown,
  IconChevronUp,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import dayjs from 'dayjs';

import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { updateBatch } from '../redux/ExpiryBatch/expiryBatchSlice';

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
    padding: '8px 12px',
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark'
        ? theme.colors.dark[4]
        : theme.colors.gray[3]
    }`,
    textAlign: 'left',
  },
  cell: {
    padding: '8px 12px',
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
  colInfo: { width: '360px' },
  colSm: { width: '160px' },
  colMd: { width: '220px' },
  colSmArrow: { width: '80px' },
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

interface Shelf {
  _id: string;
  purchaseOrderId: string;
  entryDate: string;
  manufacturingDate: string;
  expiryDate: string;
  initialStockQuantity: number;
  currentStockQuantity: number;
}

interface Purchase {
  purchaseOrderId: string;
  costPrice: number;
  sellingPrice: number;
}

interface ItemData {
  _id: string;
  sku: string;
  itemBrandName: string;
  companyName: string;
  itemShelfDates: Shelf[];
  purchaseData: Purchase[];
}

interface Props {
  items?: ItemData[];
}

export const ExpiredItemPOTable: React.FC<Props> = ({ items = [] }) => {
  const { classes, cx } = useStyles();
  const dispatch = useDispatch();

  const expiryBatchMap = useSelector(
    (state: RootState) => state.expiryBatch.items
  );

  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [editingBatches, setEditingBatches] = useState<Set<string>>(
    new Set()
  );
  const [drafts, setDrafts] = useState<
    Record<string, { manufacturingDate: Date; expiryDate: Date; currentStock: number }>
  >({});

  const toggleItem = (itemId: string) =>
    setOpenItems((prev) => {
      const next = new Set(prev);
      next.has(itemId) ? next.delete(itemId) : next.add(itemId);
      return next;
    });

  const startEdit = (e: MouseEvent, itemId: string, batch: Shelf) => {
    e.stopPropagation();
    setEditingBatches((prev) => new Set(prev).add(batch._id));

    const reduxBatches = expiryBatchMap[itemId] || [];
    const reduxRec = reduxBatches.find((b) => b.shelfId === batch._id);

    setDrafts((prev) => ({
      ...prev,
      [batch._id]: {
        manufacturingDate:
          reduxRec?.manufacturingDate ?? new Date(batch.manufacturingDate),
        expiryDate:
          reduxRec?.expiryDate ?? new Date(batch.expiryDate),
        currentStock:
          reduxRec?.quantity ?? batch.currentStockQuantity,
      },
    }));
  };

  const cancelEdit = (e: MouseEvent, batchId: string) => {
    e.stopPropagation();
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

  const saveEdit = (e: MouseEvent, itemId: string, shelfId: string) => {
    e.stopPropagation();
    const data = drafts[shelfId];
    if (!data) return;

    dispatch(
      updateBatch({
        itemId,
        shelfId,
        fields: {
          manufacturingDate: data.manufacturingDate,
          expiryDate: data.expiryDate,
          quantity: data.currentStock,
          checked: true,
        },
      })
    );
    cancelEdit(e, shelfId);
  };

  if (!items.length) {
    return <Text>No items to display.</Text>;
  }

  return (
    <ScrollArea
      type="scroll"
      scrollbarSize={8}
      style={{ width: '100%', maxHeight: 600 }}
    >
      <Table
        withBorder
        withColumnBorders
        highlightOnHover={false}
        className={classes.table}
        verticalSpacing="sm"
        horizontalSpacing="md"
        sx={{ minWidth: 1600 }}
      >
        <thead>
          <tr>
            <th className={classes.colSmArrow} />
            <th className={`${classes.header} ${classes.colInfo}`}>
              SKU / Brand / Company
            </th>
            <th className={`${classes.header} ${classes.colSm} ${classes.numeric}`}>CP</th>
            <th className={`${classes.header} ${classes.colSm} ${classes.numeric}`}>SP</th>
            <th className={`${classes.header} ${classes.colMd}`}>MFG Date</th>
            <th className={`${classes.header} ${classes.colMd}`}>Expiry Date</th>
            <th className={`${classes.header} ${classes.colSm} ${classes.numeric}`}>Init Qty</th>
            <th className={`${classes.header} ${classes.colSm} ${classes.numeric}`}>Current</th>
            <th className={classes.header}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isOpen = openItems.has(item._id);
            const reduxBatches = expiryBatchMap[item._id] || [];
            const reduxMap = Object.fromEntries(
              reduxBatches.map((b) => [b.shelfId, b])
            );
            const findPurchase = (poId: string) =>
              item.purchaseData.find((p) => p.purchaseOrderId === poId);

            return (
              <Fragment key={item._id}>
                <tr className={classes.row}>
                  <td className={classes.actionCell}>
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
                        <div>{item.sku}</div>
                        <div>{item.itemBrandName}</div>
                        <div>{item.companyName}</div>
                      </div>
                    </Tooltip>
                  </td>
                  <td className={classes.cell} colSpan={7} />
                </tr>

                {isOpen && (
                  <tr>
                    <td colSpan={9} style={{ padding: 0 }}>
                      <ScrollArea
                        type="always"
                        scrollbarSize={6}
                        style={{ height: 300, width: '100%' }}
                      >
                        <Table
                          withColumnBorders
                          highlightOnHover={false}
                          className={classes.table}
                          verticalSpacing="sm"
                          horizontalSpacing="md"
                        >
                          <thead>
                            <tr>
                              <th className={classes.header} />
                              <th className={classes.header}>PO ID</th>
                              <th className={classes.header}>Entry Date</th>
                              <th className={`${classes.header} ${classes.numeric}`}>CP</th>
                              <th className={`${classes.header} ${classes.numeric}`}>SP</th>
                              <th className={classes.header}>MFG Date</th>
                              <th className={classes.header}>Expiry Date</th>
                              <th className={`${classes.header} ${classes.numeric}`}>Init Qty</th>
                              <th className={`${classes.header} ${classes.numeric}`}>Current</th>
                              <th className={classes.header}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.itemShelfDates.map((batch) => {
                              const reduxRec = reduxMap[batch._id];
                              const isEdit = editingBatches.has(batch._id);
                              const draft = drafts[batch._id];
                              const purch = findPurchase(batch.purchaseOrderId);

                              // merged values
                              const mfg = isEdit
                                ? draft.manufacturingDate
                                : reduxRec?.manufacturingDate ?? new Date(batch.manufacturingDate);
                              const exp = isEdit
                                ? draft.expiryDate
                                : reduxRec?.expiryDate ?? new Date(batch.expiryDate);
                              const qty = isEdit
                                ? draft.currentStock
                                : reduxRec?.quantity ?? batch.currentStockQuantity;
                              const checked = reduxRec?.checked;
                              // apply blue if editing, green if saved
                              const rowClass = cx(classes.row, {
                                [classes.activeRow]: isEdit,
                                [classes.updatedRow]: !isEdit && checked,
                              });

                              return (
                                <tr
                                  key={batch._id}
                                  className={rowClass}
                                  onClick={(e) =>
                                    !isEdit && startEdit(e, item._id, batch)
                                  }
                                >
                                  <td />
                                  <td className={classes.cell}>{batch.purchaseOrderId}</td>
                                  <td className={classes.cell}>{fmt(batch.entryDate)}</td>
                                  <td className={`${classes.cell} ${classes.numeric}`}>
                                    {purch?.costPrice.toFixed(2) ?? '-'}
                                  </td>
                                  <td className={`${classes.cell} ${classes.numeric}`}>
                                    {purch?.sellingPrice.toFixed(2) ?? '-'}
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
                                    {batch.initialStockQuantity}
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
                                    {isEdit ? (
                                      <>
                                        <ActionIcon
                                          color="green"
                                          variant="filled"
                                          onClick={(e) =>
                                            saveEdit(e, item._id, batch._id)
                                          }
                                          title="Save"
                                        >
                                          <IconCheck />
                                        </ActionIcon>
                                        <ActionIcon
                                          color="red"
                                          variant="filled"
                                          onClick={(e) =>
                                            cancelEdit(e, batch._id)
                                          }
                                          title="Cancel"
                                        >
                                          <IconX />
                                        </ActionIcon>
                                      </>
                                    ) : null}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </ScrollArea>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </Table>
    </ScrollArea>
  );
};
