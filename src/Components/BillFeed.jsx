import { useState } from "react";
import { Table, Text, Collapse } from "@mantine/core";

export const BillFeed = ({ bills = [] }) => {
  return (
    <Table striped highlightOnHover>
      <thead className="heading">
        <tr>
          <th>
            <Text>Sl. No.</Text>
          </th>
          <th>
            <Text>Bill Total Amount</Text>
          </th>
          <th>
            <Text>Bill MRP Total Amount</Text>
          </th>
          <th>
            <Text>Total Items</Text>
          </th>
          <th>
            <Text>Quantity</Text>
          </th>
          <th>
            <Text>Bill date</Text>
          </th>
          <th>
            <Text>Items</Text>
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
            {item["billAmountTotal"]}
          </Text>
        </td>
        <td>
          <Text color="black" weight={500}>
            {item["billMRPTotal"]}
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
            {new Date(item["createdAt"]).toLocaleString()}
          </Text>
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
