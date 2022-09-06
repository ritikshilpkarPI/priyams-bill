import { useState } from "react";
import { Table, Text, Collapse, Button } from "@mantine/core";
import { useHistory } from "react-router-dom";

export const BillFeed = ({ bills = [] }) => {
  return (
    <Table striped highlightOnHover>
      <thead className="heading">
        <tr>
          <th>
            <Text align="center">Sl. No.</Text>
          </th>
          <th>
            <Text align="center">Bill Total Amount</Text>
          </th>
          <th>
            <Text align="center">Bill MRP Total Amount</Text>
          </th>
          <th>
            <Text align="center">Cash Paid</Text>
          </th>
          <th>
            <Text align="center">UPI Paid</Text>
          </th>
          <th>
            <Text align="center">Amount Return</Text>
          </th>
          <th>
            <Text align="center">Total Items</Text>
          </th>
          <th>
            <Text align="center">Quantity</Text>
          </th>
          <th>
            <Text align="center">Bill Discount</Text>
          </th>
          <th>
            <Text align="center">Bill Profit</Text>
          </th>
          <th>
            <Text align="center">Bill date</Text>
          </th>
          <th>
            <Text align="center">Items</Text>
          </th>
        </tr>
      </thead>
      <tbody className="body">
        {bills.map((item, idx) => {
          return <TableRow item={item} idx={idx} />;
        })}
      </tbody>
    </Table>
  );
};

const TableRow = ({ item, idx }) => {
  const [open, setOpen] = useState(false);
  let history = useHistory();
  function handleClick(id) {
    history.push(`/${id}`);
  }
  return (
    <>
      <tr
        onClick={() => setOpen(!open)}
        className="bill-row"
        style={{ cursor: "pointer" }}
        key={`${item}$${idx}`}
      >
        <td>
          <Text color="black" weight={500}>
            {idx + 1}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["billAmountTotal"].toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["billMRPTotal"].toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["cashPay"]?.toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["upiPay"]?.toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["amountReturn"]?.toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["totalNumberOfItems"]}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["totalNumberOfUniqueItems"]}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["billDiscountTotal"].toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["totalBillProfit"].toFixed(2)}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {new Date(item["createdAt"]).toLocaleString()}
          </Text>
        </td>
        <td>
          <Button onClick={() => handleClick(item["_id"])}>Edit Bill</Button>
        </td>
      </tr>
      <tr>
        <Collapse in={open}>
          <Table striped highlightOnHover>
            <thead className="heading">
              <tr>
                <th>
                  <Text>Sl. No.</Text>
                </th>
                <th>
                  <Text>Item name</Text>
                </th>
                <th>
                  <Text>Item Quantity</Text>
                </th>
                <th>
                  <Text>Item Total Amount</Text>
                </th>
              </tr>
            </thead>
            <tbody className="body">
              {item.items.map((itemObj, idx) => {
                const {
                  itemDetail,
                  itemQuantityInBill,
                  itemSellingPriceTotal,
                } = itemObj;
                return (
                  <tr key={idx}>
                    <td>
                      <Text color="black" weight={500}>
                        {idx + 1}
                      </Text>
                    </td>
                    <td>
                      <Text color="black" weight={500}>
                        {itemDetail?.itemName || "Item name not found"}
                      </Text>
                    </td>
                    <td>
                      <Text color="black" weight={500}>
                        {itemQuantityInBill}
                      </Text>
                    </td>
                    <td>
                      <Text color="black" weight={500}>
                        {itemSellingPriceTotal}
                      </Text>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Collapse>
      </tr>
    </>
  );
};
