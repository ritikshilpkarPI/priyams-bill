import React, { useState, Fragment, MouseEvent } from 'react';
import {
  Table,
  ScrollArea,
  ActionIcon,
  NumberInput,
  Text,
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
import type { InventoryRow } from 'src/types';
import { DataCell } from './DataCell';
import { POHeaderRow } from './POHeaderRow';

type ActivePO = Record<string, { poIdx: number; expIdx: number }>;

export const useStyles = createStyles((theme) => ({
  ellipsis: {
    maxWidth: 160,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  numeric: { textAlign: 'right' },
  activeRow: {
    background:
      theme.colorScheme === 'dark'
        ? theme.fn.rgba(theme.colors.blue[9], 0.2)
        : theme.fn.rgba(theme.colors.blue[3], 0.55),
  },
}));

const fmt = (d: string | Date) => dayjs(d).format('DD MMM YYYY');

interface Props {
  items?: InventoryRow[];
  onChange?: (
    itemId: string,
    poIdx: number,
    expIdx: number,
    payload: { expiryDate: Date; currentStock: number }
  ) => void;
}

export const ExpiredItemPOTable: React.FC<Props> = ({ items, onChange }) => {
  const { classes, cx } = useStyles();

  const [openRows, setOpenRows] = useState<Set<string>>(new Set());
  const [activePO, setActivePO] = useState<ActivePO>({});
  const [draft, setDraft] = useState<
    Record<string, { expiryDate: Date; currentStock: number }>
  >({});

  const toggleRow = (id: string) =>
    setOpenRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSave = (_id: string, poIdx: number, expIdx: number): void => {
    console.log({poIdx, expIdx})
    const d = draft[_id];
    if (!d || !onChange) return;
    onChange(_id, poIdx, expIdx, d);
    setDraft((prev) => ({ ...prev, [_id]: undefined as never }));
  };

  if (!items?.length) return <Text>No items to display.</Text>;

  return (
    <ScrollArea w="100%">
      <Table
        striped
        highlightOnHover
        withBorder
        sx={{
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
          '& tbody td': classes.ellipsis,
        }}
      >
        <thead>
          <tr>
            <th style={{ width: 40 }} />
            <th>SKU</th>
            <th>Brand</th>
            <th>Company</th>
            <th className={classes.numeric}>CP</th>
            <th className={classes.numeric}>SP</th>
            <th>MFG&nbsp;Date</th>
            <th>Expiry&nbsp;Date</th>
            <th className={classes.numeric}>Left&nbsp;Shelf&nbsp;Life</th>
            <th className={classes.numeric}>Initial&nbsp;Qty</th>
            <th className={classes.numeric}>Current&nbsp;Stock</th>
            <th style={{ width: 40 }} />
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const { _id } = item.staticData;
            const isOpen = openRows.has(_id);
            const sel = activePO[_id];
            const selDetail =
              sel && item.purchases[sel.poIdx]?.expiryDetails[sel.expIdx];
            const isEditing = !!draft[_id];

            return (
              <Fragment key={_id}>
                <tr className={cx({ [classes.activeRow]: sel })}>
                  <td>
                    <ActionIcon
                      variant="transparent"
                      size="sm"
                      onClick={() => toggleRow(_id)}
                    >
                      {isOpen ? (
                        <IconChevronUp size={16} />
                      ) : (
                        <IconChevronDown size={16} />
                      )}
                    </ActionIcon>
                  </td>

                  <DataCell value={item.staticData.sku} />
                  <DataCell value={item.staticData.itemBrandName} />
                  <DataCell value={item.staticData.companyName} />

                  {selDetail ? (
                    <>
                      <td className={classes.numeric}>
                        {item.purchases[sel.poIdx].cp.toFixed(2)}
                      </td>
                      <td className={classes.numeric}>
                        {item.purchases[sel.poIdx].sp.toFixed(2)}
                      </td>
                      <td>{fmt(selDetail.mfgDate)}</td>

                      <td>
                        {isEditing ? (
                          <TextInput
                            type="date"
                            value={dayjs(draft[_id].expiryDate).format(
                              'YYYY-MM-DD'
                            )}
                            onChange={(e) =>
                              setDraft((p) => ({
                                ...p,
                                [_id]: {
                                  ...p[_id],
                                  expiryDate: dayjs(
                                    e.currentTarget.value,
                                    'YYYY-MM-DD'
                                  ).toDate(),
                                },
                              }))
                            }
                            maw={160}
                          />
                        ) : (
                          fmt(selDetail.date)
                        )}
                      </td>

                      <td className={classes.numeric}>
                        {selDetail.leftShelfLife}
                      </td>
                      <td className={classes.numeric}>
                        {selDetail.initialItemQuantity}
                      </td>

                      <td className={classes.numeric}>
                        {isEditing ? (
                          <NumberInput
                            min={0}
                            value={draft[_id].currentStock}
                            onChange={(v) =>
                              setDraft((p) => ({
                                ...p,
                                [_id]: { ...p[_id], currentStock: v as number },
                              }))
                            }
                            hideControls
                          />
                        ) : (
                          selDetail.value
                        )}
                      </td>

                      <td>
                        {isEditing ? (
                          <>
                            <ActionIcon
                              color="green"
                              onClick={() =>
                                sel && handleSave(_id, sel.poIdx, sel.expIdx)
                              }
                            >
                              <IconCheck size={16} />
                            </ActionIcon>
                            <ActionIcon
                              ml="xs"
                              color="red"
                              onClick={() =>
                                setDraft((p) => ({
                                  ...p,
                                  [_id]: undefined as never,
                                }))
                              }
                            >
                              <IconX size={16} />
                            </ActionIcon>
                          </>
                        ) : null}
                      </td>
                    </>
                  ) : (
                    <td colSpan={8} />
                  )}
                </tr>

                {isOpen && (
                  <>
                    <POHeaderRow numeric={classes.numeric} />

                    {item.purchases.flatMap((po, poIdx) =>
                      po.expiryDetails.map((d, expIdx) => {
                        const isRowActive =
                          sel?.poIdx === poIdx && sel?.expIdx === expIdx;

                        const handlePickPO = (
                          e: MouseEvent<HTMLTableRowElement>
                        ) => {
                          e.stopPropagation();
                          setActivePO((prev) => ({
                            ...prev,
                            [_id]: { poIdx, expIdx },
                          }));
                          setDraft((p) => ({
                            ...p,
                            [_id]: {
                              expiryDate: new Date(d.date),
                              currentStock: d.value,
                            },
                          }));
                        };

                        return (
                          <tr
                            key={`${_id}-${po.purchaseOrderId}-${expIdx}`}
                            onClick={handlePickPO}
                            className={cx({
                              [classes.activeRow]: isRowActive,
                            })}
                          >
                            <td />
                            <DataCell value={po.dealerName} />
                            <td>{fmt(po.purchaseDate)}</td>
                            <td className={classes.numeric}>
                              {po.cp.toFixed(2)}
                            </td>
                            <td className={classes.numeric}>
                              {po.sp.toFixed(2)}
                            </td>
                            <td>{fmt(d.mfgDate)}</td>
                            <td>{fmt(d.date)}</td>
                            <td className={classes.numeric}>
                              {d.leftShelfLife}
                            </td>
                            <td className={classes.numeric}>
                              {d.initialItemQuantity}
                            </td>
                            <td className={classes.numeric}>{d.value}</td>
                          </tr>
                        );
                      })
                    )}
                  </>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </Table>
    </ScrollArea>
  );
};
