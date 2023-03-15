import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Axios } from 'src/utils/axios';

import { Button, Group, Table, Text, Title } from '@mantine/core';
import { genericAxios } from 'src/utils/genericAxiosMethod';

const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

const CustomerBill = () => {
  const params = useParams();
  const id = params.customerBillId;
  const [bill, setBill] = useState({});
  const columnName = [
    'Sr. No.',
    'Item Name',
    'Oty.',
    'MRP',
    'Discount',
    'Value',
  ];

  const fetchBill = async () => {
    const customerBill = await genericAxios({
      url: `/api/billing/getEditBill/${id}`,
      method: 'get',
      headers: {
        Cookie: '',
      },
    });
    setBill(customerBill.data.message);
  };
  useEffect(() => {
    fetchBill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const printBill = () => {
    window.print();
  };
  return (
    <div className="customer-container">
      <Button className="print-btn" onClick={printBill}>
        Print Bill
      </Button>
      <Title order={1} className="bill-header">
        Priyam Store Invoice Bill
      </Title>
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
          <Text>
            {new Date(bill?.createdAt).toLocaleDateString('en-us', options)}
          </Text>
        </Group>
      </Group>
      <Title order={3}>Purchased Items</Title>
      <div className="table-container">
        <Table sx={{ marginTop: '10px' }}>
          <thead>
            <tr>
              {columnName.map((column, index) => {
                return <th key={index}>{column}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {bill?.items?.map((item, index) => (
              <tr key={index}>
                <td className="data-cell">
                  <Text style={{ padding: '0 6px' }}>{index + 1}</Text>
                </td>
                <td className="data-cell">
                  <Text>{item?.itemDetail.itemName}</Text>
                </td>
                <td className="data-cell">
                  <Text>{item.itemQuantityInBill}</Text>
                </td>
                <td className="data-cell">
                  <Text>{item.itemMRPtotal}</Text>
                </td>
                <td className="data-cell">
                  <Text>{item.itemDiscountTotal}</Text>
                </td>
                <td className="data-cell">
                  <Text>{item.itemSellingPriceTotal}</Text>
                </td>
              </tr>
            ))}
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
      </div>
      <footer className="footer">
        <Title>ThankYou for purchasing from priyam stores. </Title>
        <Text>
          Priyam Stores, Shop No-9, Building Name, Indrapuri Bhopal-462021 |
          Contact No - 0000-000-000{' '}
        </Text>
      </footer>
    </div>
  );
};

export default CustomerBill;
