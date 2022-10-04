import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { useParams } from 'react-router-dom';

import {
  Card,
  Group,
  Table,
  Text,
  Title,
} from '@mantine/core';

const CustomerBill = () => {
  const params = useParams();
  const id = params.customerBillId;
  const [bill, setBill] = useState({});

  const fetchBill = async () => {
    const customerBill = await axios.request({
      url: `/api/billing/getEditBill/${id}`,
      method: "get",
      headers: {
        Cookie: "",
      },
    });
    console.log({ customerBill });
    setBill(customerBill.data.message);
  };
  useEffect(() => {
    fetchBill();
  }, []);
  console.log({ bill });
  return (
    <div className='customer-container'>
      <Title order={1} className="bill-header">Priyam Store Invoice Bill</Title>
        <Group mt="md" mb="xs" position="center">
          <Group position="left" mt="md" mb="xs">
            <Title order={4}>Customer Name:</Title>
            <Text>{bill.customerName}</Text>
          </Group>
          <Group position="left" mt="md" mb="xs">
            <Title order={4}>Customer Phone Number:</Title>
            <Text>{bill.customerPhone}</Text>
          </Group>
          <Group position="left" mt="md" mb="xs">
            <Title order={4}>Date Of Purchase:</Title>
            <Text>{new Date(bill?.createdAt).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})}</Text>
          </Group>
        </Group>
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Title order={3}>Purchased Items</Title>
        <Table sx={{ marginTop: "10px" }}>
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Item Name</th>
              <th>Oty.</th>
              <th>MRP</th>
              <th>Discount</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {bill?.items?.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: "0 6px", width: "60px" }}>
                  <Text style={{ padding: "0 6px", width: "60px" }}>{index + 1}</Text>
                </td>
                <td style={{ width: "350px", padding: "0 6px" }}>
                  <Text style={{ border: "0px solid red", outline: "none", display: "flex", padding:"0.5rem" }}>{item?.itemDetail.itemName}</Text>
                </td>
                <td style={{ padding: "0 6px", width: "180px" }}>
                  <Text style={{ border: "0px solid red", outline: "none", display: "flex", padding:"0.5rem" }}>{item.itemQuantityInBill}</Text>
                </td>
                <td style={{ padding: "0 6px", width: "130px" }}>
                  <Text  style={{ border: "0px solid red", outline: "none", display: "flex", padding:"0.5rem" }}>{item.itemMRPtotal}</Text>
                </td>
                <td style={{ padding: "0 6px", width: "130px" }}>
                  <Text  style={{ display: "flex", padding:"0.5rem"  }}>{item.itemDiscountTotal}</Text>
                </td>
                <td style={{ padding: "0 6px", width: "130px" }}>
                  <Text  style={{ display: "flex", padding:"0.5rem"  }}>{item.itemSellingPriceTotal}</Text>
                </td>
              </tr>
            ))}
            <tr className="final-bill">
              <td className="empty-slots"></td>
              <td className="empty-slots"></td>
              <td >
                <Text
                  color="black"
                  size="xl"
                  weight={800}
                  className="final-bill-text print-text"
                >
                  Total Items: {bill?.totalNumberOfItems?.toFixed(2)}
                </Text>
              </td>
              <td>
                <Text
                  color="black"
                  size="xl"
                  weight={800}
                  className="final-bill-text print-text"
                >
                  MRP Total: {bill?.billMRPTotal?.toFixed(2)}
                </Text>
              </td>
              <td className="empty-slots"></td>
              <td>
                <Text
                  color="black"
                  size="xl"
                  weight={800}
                  className="final-bill-text print-text"
                >
                  Bill Total: {bill?.billAmountTotal?.toFixed(2)}
                </Text>
              </td>
            </tr>
          </tbody>
          <tbody>
          <tr className="final-bill">
            <td className="empty-slots"></td>
            <td className="empty-slots"></td>
            <td>
              <Text
                color="black"
                size="xl"
                weight={800}
                className="final-bill-text print-text"
              >
                Cash Paid: {bill.cashPay}
              </Text>
              
            </td>
            <td>
              <Text
                color="black"
                size="xl"
                weight={800}
                className="final-bill-text print-text"
              >
                Upi Paid: {bill.upiPay}
              </Text>
             
            </td>
            <td className="empty-slots"></td>
            <td>
              <Text
                color="black"
                size="xl"
                weight={800}
                className="final-bill-text print-text"
              >
                Amount Return: {Number(bill.amountReturn || 0)}
              </Text>
            </td>
          </tr>
          </tbody>

        </Table>
      </Card>
      <footer className="footer">
        <Title>ThankYou for purchasing from priyam stores. </Title>
        <Text>Priyam Stores, Shop No-9, Building Name, Indrapuri Bhopal-462021 | Contact No - 0000-000-000 </Text>
      </footer>
    </div>
  );
};

export default CustomerBill;
