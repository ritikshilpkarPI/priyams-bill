import React, { useState } from 'react';
import { Table, TextInput, Text } from '@mantine/core';
import CustomNumberInput from '../customNumberInput/CustomNumberInput';
import { useDispatch } from 'react-redux';
import { updateTransactionItemShelfField } from 'src/redux/stockTransactionManagement/StockTransactionManagement';

type DestinationShelfTableProps = {
  shelfList: any[];
  itemId: any;
  disabled?: boolean;
};

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString();

const DestinationShelfTable: React.FC<DestinationShelfTableProps> = ({
  shelfList,
  itemId,
  disabled = false,
}) => {
  const dispatch = useDispatch();

  const [touchedRows, setTouchedRows] = useState<{ [key: number]: boolean }>({});

  const handleChange = (
    index: number,
    field: 'qty' | 'remark',
    value: string | number,
    shelfId: string
  ) => {
    const path = field === 'qty' ? 'destinationQuantity.qty' : 'destinationRemark';

    dispatch(
      updateTransactionItemShelfField({
        itemId,
        index,
        path,
        value,
        shelfId,
      })
    );

    if (field === 'qty') {
      setTouchedRows((prev) => ({ ...prev, [index]: true }));
    }
  };

  if (!shelfList || shelfList.length === 0) {
    return <p style={{ fontSize: 14, color: '#666' }}>No destination shelf data</p>;
  }

  return (
    <Table withBorder withColumnBorders striped highlightOnHover>
      <thead>
        <tr>
          <th>Manufacturing</th>
          <th>Expiry</th>
          <th>Source Qty</th>
          <th>Destination Qty</th>
          <th>Remark</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {shelfList.map((shelf, index) => {
          const destQty = shelf.destinationQuantity?.qty ?? 0;
          const sourceQty = shelf.sourceQuantity?.qty ?? 0;
          const isQtyMatched = destQty === sourceQty;

           const hasShelfError = shelf.itemError.errorReason !== 'NONE'
          
          return (
            <tr key={`${itemId._id}-dest-${index}`}>
              <td>{formatDate(shelf.sourceQuantity.manufacturingDate)}</td>
              <td>{formatDate(shelf.sourceQuantity.expiryDate)}</td>
              <td>{sourceQty}</td>
              <td>
                <CustomNumberInput
                  required
                  placeholder="Enter qty"
                  value={destQty}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(index, 'qty', Number(e.target.value), shelf.shelfId)
                  }
                  disabled={disabled}
                />
              </td>
              <td>
                <TextInput
                  placeholder="Enter remark"
                  value={shelf.destinationRemark ?? ''}
                  onChange={(e) =>
                    handleChange(index, 'remark', e.currentTarget.value, shelf.shelfId)
                  }
                  disabled={disabled}
                />
              </td>
              <td>
              {(touchedRows[index] || (!touchedRows[index] && hasShelfError)) && (
  <Text
    size="xs"
    color={isQtyMatched ? 'green' : 'red'}
    weight={500}
  >
    {isQtyMatched ? '✅ Matched' : '❌ Qty mismatch'}
  </Text>
)}

              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default DestinationShelfTable;
