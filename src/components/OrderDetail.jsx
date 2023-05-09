import { Button, Card, Drawer, Group, Table, Text, Title } from '@mantine/core';
import React from 'react';
import '../CSS/_orderDetail.scss';

function OrderDetail({
  order,
  opened,
  close,
  buttonStatus,
  updateOrderStatus,
}) {
  const {
    contactNumber,
    shippingAddress,
    orderNumber,
    orderStatus,
    orderDate,
    paymentMethod,
    discountAmount,
    totalQuantity,
    totalPayableAmount,
    orderItems,
    timeSlot,
    _id,
  } = order || {};
  const rows = orderItems?.map((item, index) => (
    <tr key={index}>
      <td>{item.product}</td>
      <td>{item.quantity}</td>
      <td>{item.price}</td>
    </tr>
  ));

  return (
    <Drawer
      padding="xl"
      position="right"
      keepMounted={true}
      size={450}
      opened={opened}
      onClose={close}
      title={`Purchased Order`}
    >
      <Card>
        <Title className="purchase-order-title" order={4}>
          Users Details
        </Title>
        <Group>
          <Title order={5}>Contact Number:</Title>
          <Text>{contactNumber}</Text>
        </Group>
        <Group>
          <Title order={5}>Address:</Title>
          <Text>{shippingAddress?.address}</Text>
        </Group>
      </Card>
      <Card>
        <Title className="purchase-order-title" order={4}>
          Order Details
        </Title>
        <Group className="order-detail">
          <Title order={5}>Order Number:</Title>
          <Text>{orderNumber}</Text>
        </Group>
        <Table
          className="order-detail"
          withBorder
          withColumnBorders
          verticalSpacing="md"
        >
          <thead>
            <tr>
              <th>Product</th>
              <th>Product Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <Group className="order-detail">
          <Title order={5}>Order Status:</Title>
          <Text>
            {order?.orderStatus?.[order?.orderStatus?.length - 1]?.status}
          </Text>
        </Group>
        <Group className="order-detail">
          <Title order={5}>Order Date:</Title>
          <Text>{new Date(orderDate).toLocaleDateString()}</Text>
        </Group>
        <Group className="order-detail">
          <Title order={5}>Time Slot:</Title>
          <Text>{timeSlot}</Text>
        </Group>
        <Group className="order-detail">
          <Title order={5}>Order Quantity:</Title>
          <Text>{totalQuantity}</Text>
        </Group>
      </Card>
      <Card>
        <Title className="purchase-order-title" order={4}>
          Payment Details
        </Title>
        <Group>
          <Title order={5}>Method:</Title>
          <Text>{paymentMethod}</Text>
        </Group>
        <Group>
          <Title order={5}>Discount:</Title>
          <Text>{discountAmount}</Text>
        </Group>
        <Group>
          <Title order={5}>Amount:</Title>
          <Text>{totalPayableAmount}</Text>
        </Group>
      </Card>
      <Card>
        {buttonStatus && (
          <Button
            color="teal"
            onClick={() =>
              updateOrderStatus(
                orderStatus?.[orderStatus?.length - 1]?.step,
                _id,
                buttonStatus
              )
            }
          >
            {buttonStatus}
          </Button>
        )}
      </Card>
    </Drawer>
  );
}

export default OrderDetail;
