import { useEffect, useState } from "react";
import { Table, Text, Collapse } from "@mantine/core";
import { Axios } from "../utils/axios";
import { BillFeed } from "./BillFeed";

const DayWiseBillFeed = () => {
  const [allBills, setAllBills] = useState([]);

  useEffect(() => {
    (async () => {
      const dayBill = await Axios.request({
        url: "/api/billing/allDailyBills",
        method: "get",
        headers: {
          Cookie: "",
        },
      });
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
    createdAt,
    bills,
    totalBillAmount,
    totalItemBilled,
    totalMRPAmount,
    totalNumberOfBillsForToday,
    totalQuantityBilled,
  } = item;
  const [rowOpen, setRowOpen] = useState(false);
  return (
    <>
      <tr
        onClick={() => setRowOpen(!rowOpen)}
        className={`bill-row ${rowOpen ? "rowOpen-main" : ""}`}
      >
        <td>
          <Text color="black" weight={500}>
            {idx + 1}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {new Date(createdAt).toDateString()}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {totalNumberOfBillsForToday}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {totalBillAmount}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {totalMRPAmount}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {totalItemBilled}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {totalQuantityBilled}
          </Text>
        </td>
      </tr>
      <tr>
        <Collapse
          in={rowOpen}
          transitionDuration={500}
          className={rowOpen ? "rowOpen" : ""}
          transitionTimingFunction="linear"
        >
          <BillFeed bills={bills} />
        </Collapse>
      </tr>
    </>
  );
};

export default DayWiseBillFeed;
