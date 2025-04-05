import { DateRangePicker, TimeRangeInput } from '@mantine/dates';
import { useState } from 'react';
import {
  Button,
  Collapse,
  Input,
  Select,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { genericAxios } from '../utils/genericAxiosMethod';
import { API_PATHS } from '../utils/constants/apiPaths';
import { API_METHODS } from '../utils/constants/apiMethods';

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

  const filterHasCSV = reportResult?.filterType === 'itemBillingTrend' ||
    reportResult?.filterType === 'allItemsBillingTrend' ||
    reportResult?.filterType === 'purchasedItems'

  const handleDownloadCSV = () => {
    let csvContent;
    const startDate = dateRange?.[0] ?
      formatDate(dateRange[0]) :
      'start-date';
    const fileName = `${startDate}_${selectedFilter}.csv`
      .replace(/ /g, '-')
      .toLowerCase();

    if (selectedFilter === 'purchasedItems') {
      // For purchased items filter
      const csvRows = [
        ['Barcode', 'Item Name', 'Total Purchased','Pkt. Amt', 'Pkt. Unit', 'MRP', 'Cost Price', 'Suppliers', 'First Purchase', 'Last Purchase'],
        ...reportResult.report.map(item => [
          item.barcode,
          item.itemName,
          item.totalStock,
          item.itemQuantity,
          item.unit,
          item.mrp?.toFixed(2),
          item.costPrice?.toFixed(2),
          item.suppliers.join(', '),
          formatDate(item.firstPurchaseDate),
          formatDate(item.lastPurchaseDate)
        ])
      ];
      csvContent = csvRows.map(row => row.join(',')).join('\n');
    } else {
      // For other filters
      const csvRows = [
        ['Item Name', 'Barcode', 'Quantity', 'MRP', 'Total Amount', 'Discount'],
        ...reportResult.report.map(item => ([
          item.items[0]?.itemDetail?.itemName,
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
    setLoading(true)
    const result = await genericAxios({
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
    setLoading(false)
    if (result.error) return setLoading(false);
    setReportResult(result.data);
  };

  const handleFilterOption = (e) => {
    setSelectedFilter(e);
    setReportResult({}); // Clear previous results
    setShowItemInput(e === 'itemBillingTrend');
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '50px' }}>
        <DateRangePicker
          style={{ width: '350px' }}
          label="Date Range"
          placeholder="Pick dates range"
          value={dateRange}
          onChange={setDateRange}
        />
        {/* <TimeRangeInput
          style={{ width: '350px' }}
          format="12"
          label="Time Range"
          value={timeRange}
          onChange={setTimeRange}
          clearable
        /> */}
      </div>
      <div style={{ display: 'flex', gap: '50px', paddingBottom: '10px' }}>
        <Select
          style={{ width: '350px' }}
          label="Choose Filter"
          placeholder="Pick one"
          data={[
            { value: 'itemBillingTrend', label: 'Single Item Billing Trend' },
            { value: 'allItemsBillingTrend', label: 'All Items Billing Trend' },
            { value: 'totalProfit', label: 'Total Profit sum' },
            { value: 'totalAmount', label: 'Total Amount sum' },
            { value: 'totalMRP', label: 'Total MRP sum' },
            { value: 'totalDiscount', label: 'Total Discount sum' },
            { value: 'purchasedItems', label: 'All Items Purchase Trend' },
          ]}
          value={selectedFilter}
          onChange={(e) => handleFilterOption(e)}
        />
        {showItemInput ? (
          <Input.Wrapper style={{ width: '200px' }} label="Enter Item Name">
            <Input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Input item name"
            />
          </Input.Wrapper>
        ) : (
          <></>
        )}
      </div>
      <Button 
        onClick={findResult} 
        loading={isLoading} 
        disabled={(!dateRange?.at(0) || !dateRange?.at(1) || !selectedFilter)}
      >
        Show Result
      </Button>
      <Button
        onClick={handleDownloadCSV}
        disabled={!reportResult?.report?.length}
        style={{ marginLeft: '10px' }}
      >
        Download CSV
      </Button>
      <div>
        {reportResult?.report?.length !== 0 ? (
          JSON.stringify(reportResult) !== '{}' ? (
            filterHasCSV ? (
              showBillTable(reportResult, selectedFilter)
            ) : (
              <>
                <Title>
                  {reportResult?.report[0][filterNameObj[selectedFilter]]
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
    </div>
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
        </tr>
      ) : (
        // Existing header logic
        <tr>
          <th>
            <Text align="center">Sl. No.</Text>
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
