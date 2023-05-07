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
  const rows = order.orderItems?.map((item, index) => (
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
          <Text>{order.contactNumber}</Text>
        </Group>
        <Group>
          <Title order={5}>Address:</Title>
          <Text>{order.shippingAddress?.address}</Text>
        </Group>
      </Card>
      <Card>
        <Title className="purchase-order-title" order={4}>
          Order Details
        </Title>
        <Group className="order-detail">
          <Title order={5}>Order Number:</Title>
          <Text>{order.orderNumber}</Text>
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
          <Text>{new Date(order.orderDate).toLocaleDateString()}</Text>
        </Group>
        <Group className="order-detail">
          <Title order={5}>Time Slot:</Title>
          <Text>{order.timeSlot}</Text>
        </Group>
        <Group className="order-detail">
          <Title order={5}>Order Quantity:</Title>
          <Text>{order.totalQuantity}</Text>
        </Group>
      </Card>
      <Card>
        <Title className="purchase-order-title" order={4}>
          Payment Details
        </Title>
        <Group>
          <Title order={5}>Method:</Title>
          <Text>{order.paymentMethod}</Text>
        </Group>
        <Group>
          <Title order={5}>Discount:</Title>
          <Text>{order.discountAmount}</Text>
        </Group>
        <Group>
          <Title order={5}>Amount:</Title>
          <Text>{order.totalPayableAmount}</Text>
        </Group>
      </Card>
      <Card>
        {buttonStatus && (
          <Button
            color="teal"
            onClick={() =>
              updateOrderStatus(
                order?.orderStatus?.[order?.orderStatus?.length - 1]?.step,
                order._id,
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
