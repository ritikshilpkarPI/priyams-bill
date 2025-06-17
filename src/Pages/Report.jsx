import { DateRangePicker, TimeRangeInput } from '@mantine/dates';
import { useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Container,
  Grid,
  Group,
  Input,
  Paper,
  Select,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { genericAxios } from '../utils/genericAxiosMethod';
import { API_PATHS } from '../utils/constants/apiPaths';
import { API_METHODS } from '../utils/constants/apiMethods';
import { fetchAllPaginatedAPI } from '../utils/fetchPaginatedAPI';
import ItemTrendTable from 'src/components/ItemTrendTable';
import { CONSTANTS } from '../constants/constants';
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  })
    .replace(/,/g, '')  // Remove commas
    .replace(/ /g, '-'); // 30-Dec-23 format
};

const calculateWeeklyAverage = (item, dates) => {
  const totalDays = dates.length;
  if (totalDays < 7) return null;

  const quantityMap = {};
  if (item.itemBillingTrend) {
    item.itemBillingTrend.forEach((entry) => {
      const date = new Date(entry.date).toISOString().split('T')[0];
      quantityMap[date] = (quantityMap[date] || 0) + entry.quantity;
    });
  }

  const totalQuantity = Object.values(quantityMap).reduce(
    (sum, quantity) => sum + quantity,
    0
  );
  const weeks = totalDays / 7;

  return Number((totalQuantity / weeks).toFixed(2));
};


const generateAllItemsBillingTrendCSV = (items, dateRange) => {
  const start = new Date(dateRange[0]);
  const end = new Date(dateRange[1]);
  const dates = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }

  const totalDays = dates.length;
  const showWeeklyAverage = totalDays >= 7;

  const headers = [
    CONSTANTS.TABLE_HEADERS.SKU,
    CONSTANTS.TABLE_HEADERS.ITEM_NAME,
    CONSTANTS.TABLE_HEADERS.BARCODE,
    ...(showWeeklyAverage ? ['Weekly Average'] : []),
    ...dates,
  ];
  const rows = items.map((item) => {
    const quantityMap = {};
    if (item.itemBillingTrend) {
      item.itemBillingTrend.forEach((entry) => {
        const date = new Date(entry.date).toISOString().split('T')[0];
        quantityMap[date] = (quantityMap[date] || 0) + entry.quantity;
      });
    }

    const weeklyAverage = showWeeklyAverage
      ? calculateWeeklyAverage(item, dates)
      : null;

    return [
      item.sku || item.itemDetail?.sku || '',
      item.itemDetail?.itemName || '',
      item.itemBarcode || item.itemDetail?.itemBarcode || '',
      ...(showWeeklyAverage ? [weeklyAverage?.toFixed(2) || '-'] : []),
      ...dates.map((date) => quantityMap[date] || 0),
    ];
  });

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
};

const Report = () => {
  const [dateRange, setDateRange] = useState();
  const [timeRange, setTimeRange] = useState([
    new Date().setHours(0, 0, 0, 0),
    new Date().setHours(23, 59, 59, 999)
  ]);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [reportResult, setReportResult] = useState({});
  const [showItemInput, setShowItemInput] = useState(false);
  const [itemName, setItemName] = useState('');
  const [isLoading, setLoading] = useState(false);

  const filterNameObj = {
    totalProfit: 'totalProfitSum',
    totalAmount: 'totalAmountSum',
    totalMRP: 'totalMRPSum',
    totalDiscount: 'totalDiscountSum',
    itemBillingTrend: 'itemBillingTrend',
    allItemsBillingTrend: 'allItemsBillingTrend',
    purchasedItems: 'purchasedItems',
  };

  const filterHasCSV = reportResult?.filterType === filterNameObj.itemBillingTrend ||
    reportResult?.filterType === filterNameObj.allItemsBillingTrend ||
    reportResult?.filterType === filterNameObj.purchasedItems

  const handleDownloadCSV = () => {
    let csvContent;
    const startDate = dateRange?.[0] ?
      formatDate(dateRange[0]) :
      'start-date';
    const fileName = `${startDate}_${selectedFilter}.csv`
      .replace(/ /g, '-')
      .toLowerCase();
      if (selectedFilter === filterNameObj.allItemsBillingTrend) {
        csvContent = generateAllItemsBillingTrendCSV(reportResult.report, dateRange);
      } else if (selectedFilter === filterNameObj.purchasedItems) {
      // For purchased items filter
      const csvRows = [
        ['Barcode', 'Item Name', 'Total Purchased','Pkt. Amt', 'Pkt. Unit', 'MRP', 'Cost Price', 'Suppliers', 'First Purchase', 'Last Purchase', 'Expiry Date(s)', 'Mfg Date(s)', 'Qty per Batch'],
        ...reportResult.report.map(item => {
          const expiryDates = `"${item.expiryDates.map(ed => formatDate(ed.date)).join('\n')}"`;
            const mfgDates = `"${item.expiryDates.map(ed => formatDate(ed.mfgDate)).join('\n')}"`;
            const batchQtys = `"${item.expiryDates.map(ed => `${ed.value} pcs`).join('\n')}"`;
          return [
          item.barcode,
          item.itemName,
          item.totalStock,
          item.itemQuantity,
          item.unit,
          item.mrp?.toFixed(2),
          item.costPrice?.toFixed(2),
          item.suppliers.join(', '),
          formatDate(item.firstPurchaseDate),
          formatDate(item.lastPurchaseDate),
          expiryDates,
          mfgDates,
          batchQtys
        ]})
      ];
      csvContent = csvRows.map(row => row.join(',')).join('\n');
    } else {
      // For other filters
      const csvRows = [
        ['SKU', 'Barcode', 'Quantity', 'MRP', 'Total Amount', 'Discount'],
        ...reportResult.report.map(item => ([
          item.items[0]?.itemDetail?.sku,
          item.items[0]?.itemDetail?.itemBarcode,
          item.totalQuantitysum,
          item.totalMRPsum?.toFixed(2),
          item.totalAmountSum?.toFixed(2),
          item.totalDiscountSum?.toFixed(2)
        ]))
      ];
      csvContent = csvRows.map(row => row.join(',')).join('\n');
    }
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const findResult = async () => {
    setLoading(true);
    let result;
    
    try {
      if(selectedFilter === filterNameObj.allItemsBillingTrend){
        result = await fetchAllPaginatedAPI({
          apiFunction: async (params) => {
            const response = await genericAxios({
              url: `${API_PATHS.REPORT.POST_GET_DATE_RANGE_REPORT}/${selectedFilter}`,
              method: API_METHODS.POST,
              data: {
                startDate: new Date(dateRange[0]),
                lastDate: new Date(dateRange[1]),
                startTime: new Date(timeRange[0]).toUTCString(),
                lastTime: new Date(timeRange[1]).toUTCString(),
                itemName: itemName,
              },
              params: params,
              headers: {
                Cookie: '',
              },
            });
            
            if (response.error) {
              throw new Error(`API call failed: ${response.error}`);
            }
            
            return {
              data: response.data.report.data || [],
              isError: response.error ? true : false,
              totalCount: response.data.report.total || 0
            };
          },
          parallelCalls: 4, 
          itemsPerCall: 50,
          paginationStrategy: {
            limitParamName: 'limit',
            offsetParamName: 'page',
            offsetType: 'page',
            startOffsetValue: 1
          },
          maxRetriesPerCall: 3 
        });
        
        // Floormat the result to match the expected structure
        result = { data: { report: result, filterType: selectedFilter } };
      } else {
        result = await genericAxios({
          url: `${API_PATHS.REPORT.POST_GET_DATE_RANGE_REPORT}/${selectedFilter}`,
          method: API_METHODS.POST,
          data: {
            startDate: new Date(dateRange[0]),
            lastDate: new Date(dateRange[1]),
            startTime: new Date(timeRange[0]).toUTCString(),
            lastTime: new Date(timeRange[1]).toUTCString(),
            itemName: itemName,
          },
          headers: {
            Cookie: '',
          },
        });
      }
      
      if (result && !result.error) {
        setReportResult(result.data);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterOption = (e) => {
    setSelectedFilter(e);
    setReportResult({}); // Clear previous results
    setShowItemInput(e === filterNameObj.itemBillingTrend);
  };

  return (
    <Container size="xl" py="xl">
      <Grid gutter="md">
        <Grid.Col xs={12} md={6}>
          <DateRangePicker
            style={{ width: '100%' }}
            label="Date Range"
            placeholder="Pick dates range"
            value={dateRange}
            onChange={setDateRange}
            size="md"
          />
        </Grid.Col>

        <Grid.Col xs={12} md={6}>
          <Select
            style={{ width: '100%' }}
            label="Choose Filter"
            placeholder="Pick one"
            data={[
              {
                value: 'itemBillingTrend',
                label: 'Single Item Billing Trend',
              },
              {
                value: 'allItemsBillingTrend',
                label: 'All Items Billing Trend',
              },
              { value: 'totalProfit', label: 'Total Profit sum' },
              { value: 'totalAmount', label: 'Total Amount sum' },
              { value: 'totalMRP', label: 'Total MRP sum' },
              { value: 'totalDiscount', label: 'Total Discount sum' },
              { value: 'purchasedItems', label: 'All Items Purchase Trend' },
            ]}
            value={selectedFilter}
            onChange={handleFilterOption}
            size="md"
          />
        </Grid.Col>

        {showItemInput && (
          <Grid.Col xs={12} md={6}>
            <Input.Wrapper label="Enter Item Name">
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Input item name"
                size="md"
              />
            </Input.Wrapper>
          </Grid.Col>
        )}
      </Grid>

      <Group position="apart" mt="md">
        <Group>
          <Button
            onClick={findResult}
            loading={isLoading}
            disabled={!dateRange?.at(0) || !dateRange?.at(1) || !selectedFilter}
            size="md"
            variant="filled"
          >
            Show Result
          </Button>
          <Button
            onClick={handleDownloadCSV}
            disabled={!reportResult?.report?.length}
            size="md"
            variant="outline"
          >
            Download CSV
          </Button>
        </Group>
      </Group>

      <Box mt="xl">
        <Paper shadow="sm" p="md" radius="md" withBorder>
          <Box
            sx={{
              width: '100%',
              overflowX: 'auto',
            }}
          >
            {reportResult?.filterType === filterNameObj.allItemsBillingTrend ? (
              <ItemTrendTable
                items={reportResult.report}
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                calculateWeeklyAverage={calculateWeeklyAverage}
              />
            ) : (
              <div>
                {reportResult?.report?.length !== 0 ? (
                  JSON.stringify(reportResult) !== '{}' ? (
                    filterHasCSV ? (
                      showBillTable(reportResult, selectedFilter)
                    ) : (
                      <>
                        <Title>
                          {reportResult?.report[0][
                            filterNameObj[selectedFilter]
                          ]
                            ? selectedFilter.toLocaleUpperCase()
                            : ''}
                        </Title>
                        <Text>
                          {reportResult?.report[0][
                            filterNameObj[selectedFilter]
                          ]?.toFixed(2)}
                        </Text>
                      </>
                    )
                  ) : (
                    ''
                  )
                ) : (
                  'No Report available for this date range'
                )}
              </div>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

const showBillTable = (reportResult, selectedFilter) => (
  <Table striped highlightOnHover>
    <thead className="heading">
      {selectedFilter === 'purchasedItems' ? (
        <tr>
          <th>Sl No.</th>
          <th>Barcode</th>
          <th>Item Name</th>
          <th>Total Purchased</th>
          <th>Pkt. Amt</th>
        <th>Pkt. Unit</th>
        <th>MRP</th>
          <th>Cost Price</th>
          <th>Suppliers</th>
          <th>First Purchase</th>
          <th>Last Purchase</th>
          <th style={{ minWidth: '120px' }}>Expiry Date(s)</th>
         <th style={{ minWidth: '120px' }}>Mfg Date(s)</th>
          <th style={{ minWidth: '80px' }}>Qty per Batch</th>

        </tr>
      ) : (
        // Existing header logic
        <tr>
          <th>
            <Text align="center">Sl. No.</Text>
          </th>
          <th>
            <Text align="center">SKU</Text>
          </th>
          <th>
            <Text align="center">Item Name</Text>
          </th>
          <th><Text align="center">Barcode</Text></th>
          <th>
            <Text align="center">Quantity</Text>
          </th>
          <th>
            <Text align="center">Item MRP per unit</Text>
          </th>
          <th>
            <Text align="center">Bill MRP Total Amount</Text>
          </th>
          <th>
            <Text align="center">Bill Total Amount</Text>
          </th>
          <th>
            <Text align="center">Bill Discount</Text>
          </th> 
          {reportResult.filterType === 'itemBillingTrend' ? (
            <th>
              <Text align="center">Bill date</Text>
            </th>
          ) : (
            <></>
          )}
          <th>
            <Text align="center">Bill Created By</Text>
          </th>
        </tr>
      )}
    </thead>
    <tbody className="body">
      {reportResult.report?.map((item, idx) => {
        if (selectedFilter === 'purchasedItems') {
          return (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{item.barcode}</td>
              <td>{item.itemName}</td>
              <td>{item.totalStock}</td>
              <td>{item?.itemQuantity}</td>
              <td>{item?.unit}</td>
              <td>{item.mrp?.toFixed(2)}</td>
              <td>{item.costPrice?.toFixed(2)}</td>
              <td>{item.suppliers.join(', ')}</td>
              <td>{formatDate(item.firstPurchaseDate)}</td>
              <td>{formatDate(item.lastPurchaseDate)}</td>
              <td>
  {item?.expiryDates?.map((ed, i) => (
    <div key={i}>
      <strong>{formatDate(ed?.date)}</strong>
    </div>
  ))}
</td>
<td>
  {item?.expiryDates?.map((ed, i) => (
    <div key={i}>{formatDate(ed?.mfgDate)}</div>
  ))}
</td>
<td>
    {item?.expiryDates?.map((ed, i) => (
      <div key={i}>{ed?.value} pcs</div>
    ))}
  </td>
            </tr>
          )
        } else {
          return (
            <TableRow
              key={`${item}$${idx}`}
              itemBill={item}
              idx={idx}
              filterName={reportResult.filterType}
            />
          );
        }
      })}
    </tbody>
  </Table>
);

const TableRow = ({ itemBill, idx, filterName }) => {
  const [open, setOpen] = useState(false);
  const firstItem = itemBill?.items?.[0]?.itemDetail || {};

  return (
    <>
      <tr
        onClick={() => setOpen(!open)}
        className="bill-row"
        style={{ cursor: 'pointer' }}
      >
        <td>
          <Text color="black" weight={500}>
            {idx + 1}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {itemBill.items[0]?.itemDetail?.sku ||
              itemBill.items.itemDetail?.sku || "N/A"}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {itemBill.items[0]?.itemDetail?.itemName ||
              itemBill.items.itemDetail?.itemName || "N/A"}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {itemBill.items[0]?.itemDetail?.itemBarcode ||
              itemBill.items.itemDetail?.itemBarcode || "N/A"}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {itemBill.items?.itemQuantityInBill || itemBill['totalQuantitysum'] || 0}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {itemBill.items[0]?.itemDetail?.itemMRPperUnit ||
              itemBill.items.itemDetail?.itemMRPperUnit}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {itemBill.items?.itemMRPtotal?.toFixed(2) ||
              itemBill['totalMRPsum']?.toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {itemBill.items?.itemSellingPriceTotal?.toFixed(2) ||
              itemBill['totalAmountSum']?.toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {itemBill.items?.itemDiscountTotal?.toFixed(2) ||
              itemBill['totalDiscountSum']?.toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {filterName === 'itemBillingTrend'
              ? new Date(itemBill['createdAt'])?.toLocaleString()
              : ''}
          </Text>
        </td>
        <td>
          <Text color="black" weight={700}>
            {itemBill?.staffId?.name || itemBill?.staffId?.username || "N/A"}
          </Text>
        </td>
      </tr>
      {filterName !== 'itemBillingTrend' ? (
        <tr>
          <Collapse in={open}>
            <Table striped highlightOnHover>
              <thead className="heading">
                <tr>
                  <th>
                    <Text>Sl. No.</Text>
                  </th>
                  <th>
                    <Text>Name</Text>
                  </th>
                  <th>
                    <Text>Quantity</Text>
                  </th>
                  <th>
                    <Text>MRP</Text>
                  </th>
                  <th>
                    <Text>Total Amount</Text>
                  </th>
                  <th>
                    <Text>Bill date</Text>
                  </th>
                </tr>
              </thead>
              <tbody className="body">
                {itemBill.items?.map((item, idx) => {
                  return (
                    <tr key={idx}>
                      <td>
                        <Text color="black" weight={500}>
                          {idx + 1}
                        </Text>
                      </td>
                      <td>
                        <Text color="black" weight={500}>
                          {item?.itemDetail?.itemName}
                        </Text>
                      </td>
                      <td>
                        <Text color="black" weight={500}>
                          {item?.itemQuantityInBill}
                        </Text>
                      </td>
                      <td>
                        <Text color="black" weight={500}>
                          {item?.itemMRPtotal}
                        </Text>
                      </td>
                      <td>
                        <Text color="black" weight={500}>
                          {item?.itemSellingPriceTotal?.toFixed(2)}
                        </Text>
                      </td>
                      <td>
                        <Text color="black" weight={500}>
                          {new Date(
                            itemBill?.createdAtDates[idx]
                          )?.toLocaleString()}
                        </Text>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Collapse>
        </tr>
      ) : (
        <></>
      )}
    </>
  );
};

export default Report;
