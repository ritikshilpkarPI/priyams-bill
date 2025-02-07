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

const Report = () => {
  const [dateRange, setDateRange] = useState();
  const [timeRange, setTimeRange] = useState();
  const [selectedFilter, setSelectedFilter] = useState('');
  const [reportResult, setReportResult] = useState({});
  const [showItemInput, setShowItemInput] = useState(false);
  const [itemName, setItemName] = useState('');

  const filterNameObj = {
    totalProfit: 'totalProfitSum',
    totalAmount: 'totalAmountSum',
    totalMRP: 'totalMRPSum',
    totalDiscount: 'totalDiscountSum',
    itemBillingTrend: 'itemBillingTrend',
    allItemsBillingTrend: 'allItemsBillingTrend',
  };

  const findResult = async () => {
    const result = await genericAxios({
      url: `${API_PATHS.REPORT.POST_GET_DATE_RANGE_REPORT}/${selectedFilter}`,
      method: API_METHODS.POST,
      data: {
        startDate: new Date(dateRange[0]),
        lastDate: new Date(dateRange[1]),
        startTime: timeRange[0].toUTCString(),
        lastTime: timeRange[1].toUTCString(),
        itemName: itemName,
      },
      headers: {
        Cookie: '',
      },
    });
    if(result.error)return
    setReportResult(result.data);
  };

  const handleFilterOption = (e) => {
    setSelectedFilter(e);
    e === 'itemBillingTrend' ? setShowItemInput(true) : setShowItemInput(false);
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
        <TimeRangeInput
          style={{ width: '350px' }}
          format="12"
          label="Time Range"
          value={timeRange}
          onChange={setTimeRange}
          clearable
        />
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
      <Button onClick={findResult}>Show Result</Button>
      <div>
        {reportResult?.report?.length !== 0 ? (
          JSON.stringify(reportResult) !== '{}' ? (
            reportResult?.filterType === 'itemBillingTrend' ||
            reportResult?.filterType === 'allItemsBillingTrend' ? (
              showBillTable(reportResult)
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

const showBillTable = (reportResult) => (
  <Table striped highlightOnHover>
    <thead className="heading">
      <tr>
        <th>
          <Text align="center">Sl. No.</Text>
        </th>
        <th>
          <Text align="center">Item Name</Text>
        </th>
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
    </thead>
    <tbody className="body">
      {reportResult.report?.map((item, idx) => {
        return (
          <TableRow
            key={`${item}$${idx}`}
            itemBill={item}
            idx={idx}
            filterName={reportResult.filterType}
          />
        );
      })}
    </tbody>
  </Table>
);

const TableRow = ({ itemBill, idx, filterName }) => {
  const [open, setOpen] = useState(false);
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
              itemBill.items.itemDetail?.itemName}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {itemBill.items?.itemQuantityInBill || itemBill['totalQuantitysum']}
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
