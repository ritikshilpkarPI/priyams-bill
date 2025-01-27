import { useEffect, useState } from 'react';
import { Table, Text, Collapse } from '@mantine/core';
import { genericAxios } from '../utils/genericAxiosMethod';
import { API_PATHS } from '../utils/constants/apiPaths';
import { API_METHODS } from '../utils/constants/apiMethods';
import BillFeed from './BillFeed';

const DayWiseBillFeed = () => {
  const [allBills, setAllBills] = useState([]);

  useEffect(() => {
    (async () => {
      const dayBill = await genericAxios({
        url: API_PATHS.BILLING.GET_ALL_DAILY_BILLS,
        method: API_METHODS.GET,
        headers: {
          Cookie: '',
        },
      });
      if (dayBill.error) return;
      setAllBills(dayBill.data.message.allDailyBills);
    })();
  }, []);

  return (
    <Table striped highlightOnHover>
      <thead className="heading">
        <tr>
          <th>
            <Text>Sl. No.</Text>
          </th>
          <th>
            <Text>Bill Date</Text>
          </th>
          <th>
            <Text>No. Of Bills</Text>
          </th>
          <th>
            <Text>Date Total Amount</Text>
          </th>
          <th>
            <Text>Date MRP Total Amount</Text>
          </th>
          <th>
            <Text>Date Total Items</Text>
          </th>
          <th>
            <Text>Date Quantity</Text>
          </th>
          <th>
            <Text>Date Profit</Text>
          </th>
          <th>
            <Text>Cash Paid</Text>
          </th>
          <th>
            <Text>UPI Paid</Text>
          </th>
          <th>
            <Text>Amount Returned</Text>
          </th>
          <th>
            <Text>Bills</Text>
          </th>
        </tr>
      </thead>
      <tbody className="body">
        {allBills.map((item, idx) => {
          return <TableRow key={idx} item={item} idx={idx} />;
        })}
      </tbody>
    </Table>
  );
};

const TableRow = ({ item, idx }) => {
  const {
    _id,
    // createdAt,
    dayBills,
    totalBillAmount,
    totalItemBilled,
    totalMRPAmount,
    totalNumberOfBillsForToday,
    totalQuantityBilled,
    totalDailyProfit,
    totalCashPay,
    totalUpiPay,
    totalAmountReturn,
  } = item;
  const [rowOpen, setRowOpen] = useState(false);
  return (
    <>
      <tr
        onClick={() => setRowOpen(!rowOpen)}
        className={`bill-row ${rowOpen ? 'rowOpen-main' : ''}`}
      >
        <td>
          <Text color="black" weight={500}>
            {idx + 1}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {new Date(_id).toDateString()}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {totalNumberOfBillsForToday}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {totalBillAmount.toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {totalMRPAmount.toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {totalItemBilled}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {totalQuantityBilled.toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {totalDailyProfit.toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {totalCashPay.toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {totalUpiPay.toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {totalAmountReturn.toFixed(2)}
          </Text>
        </td>
      </tr>
      {/* `rowOpen` shows all the day bills only when the row is clicked.
      Becasue of this the bill feed data is only added to the page when the row
      is clicked. This keeps the UI lightweight otherwise. */}
      {rowOpen && (
        <tr>
          <Collapse
            in={rowOpen}
            transitionDuration={500}
            className={rowOpen ? 'rowOpen' : ''}
            transitionTimingFunction="linear"
          >
            <BillFeed fromDayWise={true} bills={dayBills} />
          </Collapse>
        </tr>
      )}
    </>
  );
};

export default DayWiseBillFeed;
