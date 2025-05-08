import React, { useState } from 'react';
import {
  Table,
  Text,
  Button,
  Stack,
  Group,
  Divider,
  Paper,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useDispatch } from 'react-redux';
import CustomNumberInput from '../customNumberInput/CustomNumberInput';
import { addExpiryBatches } from 'src/redux/stockTransactionManagement/StockTransactionManagement';

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString();

const ShelfTable: React.FC<ShelfTableProps> = ({
  shelfList,
  itemId,
  handleQuantityChange,
  showNewExpiryForm = false,
}) => {
  const dispatch = useDispatch();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    expiryDate: null as Date | null,
    manufacturingDate: null as Date | null,
    quantity: 0,
  });
  const [entries, setEntries] = useState<any[]>([]);

  const handleFormChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addEntry = () => {
    if (!form.expiryDate || !form.manufacturingDate || form.quantity <= 0) {
      alert('Please fill all fields');
      return;
    }

    setEntries((prev) => [...prev, form]);
    setForm({ expiryDate: null, manufacturingDate: null, quantity: 0 });
    setShowForm(false);
  };

  const handleSave = () => {
    if (entries.length === 0) {
      alert('No entries to save');
      return;
    }

    dispatch(
      addExpiryBatches({
        itemId,
        entries,
      })
    );
    setEntries([]);
  };

  return (
    <>
      {!shelfList || shelfList.length === 0 ? (
        <Text size="sm">No expiry batches</Text>
      ) : (
        <Table withBorder withColumnBorders>
          <thead>
            <tr>
              <th>Manufacturing</th>
              <th>Expiry</th>
              <th>Stock</th>
              <th>Qty to Add</th>
            </tr>
          </thead>
          <tbody>
            {shelfList.map((shelf) => (
              <tr key={shelf.shelfId}>
                <td>{formatDate(shelf.sourceQuantity.manufacturingDate)}</td>
                <td>{formatDate(shelf.sourceQuantity.expiryDate ?? '')}</td>
                <td>{shelf.sourceQuantity.quantity}</td>
                <td>
                  <CustomNumberInput
                    required
                    placeholder="Enter qty"
                    value={shelf.sourceQuantity.qty ?? 0}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleQuantityChange(
                        itemId,
                        shelf.sourceQuantity.quantity,
                        Number(e.target.value),
                        shelf.shelfId
                      )
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {showNewExpiryForm && (
        <Paper shadow="xs" p="md" mt="lg" radius="md" withBorder>
          <Stack spacing="md">
            <Divider label="Add New Expiry Batch" labelPosition="center" />

            <Button
              onClick={() => setShowForm((prev) => !prev)}
              variant={showForm ? 'light' : 'filled'}
            >
              {showForm ? 'Cancel' : 'Add New Expiry'}
            </Button>

            {showForm && (
              <Stack spacing="md">
                <Group grow>
                  <DatePicker
                    label="Expiry Date"
                    placeholder="Select expiry date"
                    value={form.expiryDate}
                    onChange={(value) => handleFormChange('expiryDate', value)}
                    required
                  />
                  <DatePicker
                    label="Manufacturing Date"
                    placeholder="Select manufacturing date"
                    value={form.manufacturingDate}
                    onChange={(value) =>
                      handleFormChange('manufacturingDate', value)
                    }
                    required
                  />
                </Group>

                <CustomNumberInput
                  required
                  label="Quantity"
                  placeholder="Enter quantity"
                  value={form.quantity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleFormChange('quantity', Number(e.target.value))
                  }
                />

                <Group position="right">
                  <Button onClick={addEntry}>Add</Button>
                </Group>
              </Stack>
            )}

            {entries.length > 0 && (
              <>
                <Divider label="Pending Entries" labelPosition="center" />
                {entries.map((entry, idx) => (
                  <Group key={idx} position="apart">
                    <Text size="sm">
                      Exp: {entry.expiryDate.toLocaleDateString()} | Mfg:{' '}
                      {entry.manufacturingDate.toLocaleDateString()} | Qty:{' '}
                      {entry.quantity}
                    </Text>
                  </Group>
                ))}

                <Group position="right">
                  <Button color="green" onClick={handleSave}>
                    Save All
                  </Button>
                </Group>
              </>
            )}
          </Stack>
        </Paper>
      )}
    </>
  );
};

export default ShelfTable;
