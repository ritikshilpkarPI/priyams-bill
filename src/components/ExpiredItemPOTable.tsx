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
import type { InventoryRow } from 'src/types';
import { POHeaderRow } from './POHeaderRow';

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
  numeric: {
    textAlign: 'right',
  },
  actionCell: {
    width: 80,
    padding: 0,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs
  },
  colSm: { width: '160px' },
  colMd: { width: '220px' },
  colLg: { width: '280px' },
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
  input: {
    maxWidth: '120px',
    fontSize: theme.fontSizes.sm,
  },
  ellipsis: {
    maxWidth: '120px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
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
  const [activePO, setActivePO] = useState<Record<
    string,
    { poIdx: number; expIdx: number }
  >>({});
  const [draft, setDraft] = useState<
    Record<string, { expiryDate: Date; currentStock: number }>
  >({});

  const toggleRow = (id: string) =>
    setOpenRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleSave = (_id: string, poIdx: number, expIdx: number) => {
    const d = draft[_id];
    if (!d || !onChange) return;
    onChange(_id, poIdx, expIdx, d);
    setDraft((p) => ({ ...p, [_id]: undefined as never }));
  };

  if (!items?.length) return <Text>No items to display.</Text>;

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
            <th className={`${classes.header} ${classes.colMd}`} />
            <th className={`${classes.header} ${classes.colMd}`}>SKU</th>
            <th className={`${classes.header} ${classes.colMd}`}>Brand</th>
            <th className={`${classes.header} ${classes.colLg}`}>Company</th>
            <th className={`${classes.header} ${classes.colSm} ${classes.numeric}`}>
              CP
            </th>
            <th className={`${classes.header} ${classes.colSm} ${classes.numeric}`}>
              SP
            </th>
            <th className={`${classes.header} ${classes.colMd}`}>MFG Date</th>
            <th className={`${classes.header} ${classes.colMd}`}>Expiry Date</th>
            <th className={`${classes.header} ${classes.colSm} ${classes.numeric}`}>
              Shelf Life
            </th>
            <th className={`${classes.header} ${classes.colSm} ${classes.numeric}`}>
              Init Qty
            </th>
            <th className={`${classes.header} ${classes.colSm} ${classes.numeric}`}>
              Current
            </th>
            <th className={`${classes.header} ${classes.colSm} ${classes.numeric} ${classes.actionCell}` } >
              Edit
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const id = item.staticData._id;
            const isOpen = openRows.has(id);
            const sel = activePO[id];
            const selDetail =
              sel && item.purchases[sel.poIdx]?.expiryDetails[sel.expIdx];
            const isEditing = !!draft[id];

            return (
              <Fragment key={id}>
                {/* main row */}
                <tr className={cx(classes.row, { [classes.activeRow]: sel })}>
                  <td className={classes.actionCell}>
                    <ActionIcon
                      variant="transparent"
                      size="sm"
                      onClick={() => toggleRow(id)}
                    >
                      {isOpen ? (
                        <IconChevronUp size={16} />
                      ) : (
                        <IconChevronDown size={16} />
                      )}
                    </ActionIcon>
                  </td>

                  <td className={`${classes.cell} ${classes.colMd}`}>
                    <Tooltip label={item.staticData.sku} withArrow position="top">
                      <span>{item.staticData.sku}</span>
                    </Tooltip>
                  </td>
                  <td className={`${classes.cell} ${classes.colMd}`}>
                    <Tooltip
                      label={item.staticData.itemBrandName}
                      withArrow
                      position="top"
                    >
                      <span>{item.staticData.itemBrandName}</span>
                    </Tooltip>
                  </td>
                  <td className={`${classes.cell} ${classes.colLg}`}>
                    <Tooltip
                      label={item.staticData.companyName}
                      withArrow
                      position="top"
                    >
                      <span>{item.staticData.companyName}</span>
                    </Tooltip>
                  </td>

                  {selDetail ? (
                    <>
                      <td
                        className={`${classes.cell} ${classes.colSm} ${classes.numeric}`}
                      >
                        {item.purchases[sel.poIdx].cp.toFixed(2)}
                      </td>
                      <td
                        className={`${classes.cell} ${classes.colSm} ${classes.numeric}`}
                      >
                        {item.purchases[sel.poIdx].sp.toFixed(2)}
                      </td>
                      <td className={`${classes.cell} ${classes.colMd}`}>
                        {fmt(selDetail.mfgDate)}
                      </td>
                      <td className={`${classes.cell} ${classes.colMd}`}>
                        {isEditing ? (
                          <TextInput
                            type="date"
                            value={dayjs(draft[id].expiryDate).format(
                              'YYYY-MM-DD'
                            )}
                            onChange={(e) =>
                              setDraft((p) => ({
                                ...p,
                                [id]: {
                                  ...p[id],
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
                          fmt(selDetail.date)
                        )}
                      </td>
                      <td
                        className={`${classes.cell} ${classes.colSm} ${classes.numeric}`}
                      >
                        {selDetail.leftShelfLife}
                      </td>
                      <td
                        className={`${classes.cell} ${classes.colSm} ${classes.numeric}`}
                      >
                        {selDetail.initialItemQuantity}
                      </td>
                      <td
                        className={`${classes.cell} ${classes.colSm} ${classes.numeric}`}
                      >
                        {isEditing ? (
                          <NumberInput
                            min={0}
                            value={draft[id].currentStock}
                            onChange={(v) =>
                              setDraft((p) => ({
                                ...p,
                                [id]: {
                                  ...p[id],
                                  currentStock: v as number,
                                },
                              }))
                            }
                            className={classes.input}
                            hideControls
                          />
                        ) : (
                          selDetail.value
                        )}
                      </td>
<td className={classes.actionCell}>
  {isEditing && sel && (
    <>
      <ActionIcon
        size="lg"                 
        radius="sm"
        color="green"
        variant="filled"
        onClick={() => handleSave(id, sel.poIdx, sel.expIdx)}
        title="Save"
      >
        <IconCheck size={20} />   
      </ActionIcon>

      <ActionIcon
        size="lg"
        radius="sm"
        color="red"
        variant="filled"
        onClick={() =>
          setDraft((p) => ({ ...p, [id]: undefined as never }))
        }
        title="Cancel"
      >
        <IconX size={20} />
      </ActionIcon>
    </>
  )}
</td>

                    </>
                  ) : (
                    <td className={classes.cell} colSpan={8} />
                  )}
                </tr>

                {/* expanded PO rows */}
                {isOpen && (
                  <>
                    <POHeaderRow numeric={classes.numeric} />
                    {item.purchases.flatMap((po, poIdx) =>
                      po.expiryDetails.map((d, expIdx) => {
                        const isRowActive =
                          sel?.poIdx === poIdx && sel?.expIdx === expIdx;
                        const pick = (e: MouseEvent<HTMLTableRowElement>) => {
                          e.stopPropagation();
                          setActivePO((prev) => ({
                            ...prev,
                            [id]: { poIdx, expIdx },
                          }));
                          setDraft((p) => ({
                            ...p,
                            [id]: {
                              expiryDate: new Date(d.date),
                              currentStock: d.value,
                            },
                          }));
                        };
                        return (
                          <tr
                            key={`${id}-${po.purchaseOrderId}-${expIdx}`}
                            onClick={pick}
                            className={cx(classes.row, {
                              [classes.activeRow]: isRowActive,
                            })}
                          >
                            <td className={classes.actionCell} />
                            <td className={`${classes.cell} ${classes.colMd}`}>
                              <Tooltip label={po.dealerName} withArrow position="top">
                                <span>{po.dealerName}</span>
                              </Tooltip>
                            </td>
                            <td className={classes.cell}>
                              {fmt(po.purchaseDate)}
                            </td>
                            <td
                              className={`${classes.cell} ${classes.numeric}`}
                            >
                              {po.cp.toFixed(2)}
                            </td>
                            <td
                              className={`${classes.cell} ${classes.numeric}`}
                            >
                              {po.sp.toFixed(2)}
                            </td>
                            <td className={classes.cell}>
                              {fmt(d.mfgDate)}
                            </td>
                            <td className={classes.cell}>
                              {fmt(d.date)}
                            </td>
                            <td
                              className={`${classes.cell} ${classes.numeric}`}
                            >
                              {d.leftShelfLife}
                            </td>
                            <td
                              className={`${classes.cell} ${classes.numeric}`}
                            >
                              {d.initialItemQuantity}
                            </td>
                            <td
                              className={`${classes.cell} ${classes.numeric}`}
                            >
                              {d.value}
                            </td>
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
