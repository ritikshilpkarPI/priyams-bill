import React, { useEffect, useState } from 'react';
import { Badge, Box, Button, Flex, Table, Title, Group, Text } from '@mantine/core';
import { useSelector } from 'react-redux';
import { selectPurchasedItems } from '../../redux/purchaseOrder/purchaseOrderSelectors';
import { ItemExpiryTable } from '../ItemExpiryTable/ItemExpiryTable';
import { IconEdit, IconX } from '@tabler/icons-react';
import './purchasedItemTable.css';
import { SellDetailsTable } from '../sellDetailsTable/SellDetailsTable';
import { getItemsSellDetailsByPurchaseOrderIdAPI } from 'src/utils/apiUtils';
import { getDateBeforeMonths } from 'src/utils/getDateBeforeMonths';
import { convertDateToISO } from 'src/utils/convertDateToISO';
import { convertMonthDates } from 'src/utils/convertMonthDates';
import { formatSoldItemsByDate } from 'src/utils/formatSoldItemsByDate';
import { CONSTANTS } from '../../constants/constants';
import { ImagePreview } from '../ImagePreview/ImagePreview';

export const PurchasedItemTable = ({
  onRemove,
  onEdit,
  loadingRemoveItemById,
  isApprovedPO
}: PurchasedItemTableProps) => {
  const purchasedItems = useSelector(selectPurchasedItems);

  const [tableData, setTableData] = useState<ItemSoldInterface[]>([]);

  const lastOneMonthDate = getDateBeforeMonths(1);
  const lastThreeMonthDate = getDateBeforeMonths(3);
  const lastYearDate = getDateBeforeMonths(12);
  const currentDate = convertDateToISO(new Date());

  const updateTableData = (
    tableData: ItemSoldInterface[]
  ): ItemSoldInterface[] => {
    return tableData.map((data) => {
      const lastMonthData = data.intervals
        .find((interval) => interval.startDate === lastOneMonthDate)
        ?.data?.reduce((sum, data) => sum + data.value, 0);

      const lastThreeMonthData = data.intervals.find(
        (interval) => interval.startDate === lastThreeMonthDate
      )?.data;

      const lastYearData = data.intervals.find(
        (interval) => interval.startDate === lastYearDate
      )?.data;

      return {
        ...data,
        lastMonthSold: lastMonthData,
        lastYearSold: lastYearData ? convertMonthDates(lastYearData) : [],
        lastThreeMonthSold: lastThreeMonthData
          ? formatSoldItemsByDate(lastThreeMonthData)
          : [],
      };
    });
  };

  const purchaseOrderId =
    typeof window !== 'undefined' && window.location.pathname.split('/')[2];

  const fetchSellDetails = async (
    intervals: IntervalPropInterface[],
    purchaseOrderId: string
  ) => {
    try {
      const response = await getItemsSellDetailsByPurchaseOrderIdAPI(
        purchaseOrderId,
        intervals
      );
      const updatedResponse = updateTableData(response?.data);
      setTableData(updatedResponse);

      return response?.isError ? null : response.data;
    } catch (error) {
      return null;
    }
  };

  const getDateRange = (months: number) => {
    const endDate = new Date(); 
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    return {
      startDate: startDate.toISOString().split('T')[0], 
      endDate: endDate.toISOString().split('T')[0],
    };
  };

  useEffect(() => {
    const data = fetchSellDetails(
      [
        { ...getDateRange(12), timePeriod: 'monthly' },
        { ...getDateRange(3), timePeriod: 'weekly' },
        { ...getDateRange(1), timePeriod: 'monthly' }, 
      ],
      purchaseOrderId || ''
    );
  }, []);

  const rows = purchasedItems?.map((purchasedItem, idx) => (
    <tr key={`${purchasedItem._id}_${idx}`} className="purchased-item-table-row">
      <td>
        <Group spacing="xs">
          <Text>{purchasedItem?.barcode || '-'}</Text>
          <ImagePreview images={purchasedItem?.barcodeImages || []} title="Barcode Images" />
        </Group>
      </td>
      <td>
        <Group spacing="xs">
          <Text>{purchasedItem?.inputName || '-'}</Text>
          <ImagePreview images={purchasedItem?.itemNameImages || []} title="Item Name Images" />
        </Group>
      </td>
      <td>
        <Group spacing="xs">
          <Text>{purchasedItem?.itemQuantity || '-'}</Text>
          <ImagePreview images={purchasedItem?.packetQtyImages || []} title="Packet Quantity Images" />
        </Group>
      </td>
      <td>
        <Group spacing="xs">
          <Text>{purchasedItem?.unit || '-'}</Text>
          <ImagePreview images={purchasedItem?.unitImages || []} title="Unit Images" />
        </Group>
      </td>
      <td>
        <Group spacing="xs">
          <Text>{purchasedItem?.mrp || '-'}</Text>
          <ImagePreview images={purchasedItem?.mrpImages || []} title="MRP Images" />
        </Group>
      </td>
      <td>
        <Group spacing="xs">
          <Text>{purchasedItem?.costPrice || '-'}</Text>
          <ImagePreview images={purchasedItem?.costPriceImages || []} title="Cost Price Images" />
        </Group>
      </td>
      <td>
        <Group spacing="xs">
          <Text>{purchasedItem?.sellingPrice || '-'}</Text>
          <ImagePreview images={purchasedItem?.sellingPriceImages || []} title="Selling Price Images" />
        </Group>
      </td>
      <td>{purchasedItem?.profitPercentage || '-'}</td>
      <td>
        <Group spacing="xs">
          <Text>{purchasedItem?.stockQuantity || '-'}</Text>
          <ImagePreview images={purchasedItem?.stockQuantityImages || []} title="Stock Quantity Images" />
        </Group>
      </td>
      <td>{purchasedItem?.itemRemark || '-'}</td>
      <td>{purchasedItem?.itemHasExpiry !== null? purchasedItem?.itemHasExpiry? CONSTANTS.YES : CONSTANTS.NO : "-"}</td>
      <td>
        {purchasedItem.expiryDates?.length > -0 ? (
          <ItemExpiryTable
            expiryDates={purchasedItem.expiryDates}
            onRemove={() => console.log('Function not implemented yet')}
          />
        ) : (
          '-'
        )}
      </td>
      <td>
        {(
          (isApprovedPO && ( purchasedItem?.newItem)) ||
          (!isApprovedPO && (!purchasedItem.item_id || purchasedItem?.newItem))
        ) && (
          <Badge color="green">New Item</Badge>
        )}
      </td>     
      <td className="purchased-item-table-action-td">
        <Button
          disabled={Boolean(loadingRemoveItemById) || isApprovedPO}
          variant="default"
          leftIcon={<IconEdit cursor="pointer" />}
          onClick={() => onEdit(purchasedItem, idx)}
        >
          Edit
        </Button>
        <Button
          loading={purchasedItem._id === loadingRemoveItemById}
          disabled={Boolean(
            loadingRemoveItemById && purchasedItem._id !== loadingRemoveItemById
          ) || isApprovedPO}
          variant="default"
          color="red"
          leftIcon={<IconX cursor="pointer" />}
          onClick={() => onRemove(purchasedItem, idx)}
        >
          Remove
        </Button>
      </td>
      <td>
        {tableData?.length > 0 &&
          tableData.some((item) => item.itemId === purchasedItem.item_id) && (
            <SellDetailsTable
              tableData={tableData.filter(
                (item) => item.itemId === purchasedItem.item_id
              )}
              currentDate={currentDate}
              lastThreeMonthDate={lastThreeMonthDate}
              lastYearDate={lastYearDate}
              isPODetailsPage={true}
            />
          )}
      </td>
    </tr>
  ));
  return (
    <Flex
      align="left"
      gap="16px"
      direction="column"
      sx={{
        border: '1px solid grey',
        padding: '16px',
        borderRadius: '8px',
        textAlign: 'left',
      }}
      mx="sm"
      mt="16px"
    >
      <Title order={3}>Added Items</Title>
      <Box
        sx={{
          maxHeight: '70vh',
          overflow: 'scroll',
          "&::-webkit-scrollbar": {
            display: "none",
          },
          border: '0.5px solid #ddd',
          borderRadius: "6px",
        }}
      >
        <Table withColumnBorders striped withBorder>
          <thead
            style={{
              position: 'sticky',
              top: 0,
              background: 'white',
              zIndex: 1,
            }}
          >
            <tr>
              <th>Barcode</th>
              <th>Item Name</th>
              <th>Packet Amount</th>
              <th>Unit</th>
              <th>MRP</th>
              <th>CP</th>
              <th>SP</th>
              <th>Profit %</th>
              <th>Order Quantity</th>
              <th>Remarks</th>
              <th>Has Expiry</th>
              <th>Expiry Summary</th>
              <th>Tags</th>
              <th>Actions</th>
              {tableData?.length > 0 && <th>Sell details</th>}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Box>
    </Flex>
  );
};
