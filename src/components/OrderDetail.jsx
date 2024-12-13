import { Button, Card, Drawer, Group, Modal, Table, Text, Title } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
import '../CSS/_orderDetail.scss';
import { useBeep } from 'src/utils/beep';

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
      <td> <img style={{
        width: "100px",
        height: "100px"
      }} src={item.product?.images?.[0]?.secureUrl} alt="product-image" /></td>
      <td>{item.product.itemName}</td>
      <td>{item.quantity}</td>
      <td>{item.price}</td>
    </tr>
  ));

  const { beep, stopBeep } = useBeep(`${process.env.ORDER_NOTIFICATION_SOUND}`);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const isCheckingRef = useRef(false);

  const latestOrderStatus = orderStatus?.[orderStatus?.length - 1]?.status || "Pending";

  const checkPendingPackaging = () => {
    const pendingStatuses = orderStatus?.filter((status) =>
      (status.step === 2 && !orderStatus.some((s) => s.step === 3)) || 
      (status.step === 3 && !orderStatus.some((s) => s.step === 4))
    );
    
    const hasPendingPackaging = pendingStatuses.length > 0;
    if (hasPendingPackaging) {
      isCheckingRef.current = true;
      beep();
      setTimeout(() => {
        setShowConfirmDialog(true);
      }, 1000);
    }
  };

  const handleConfirm = () => {
    stopBeep();
    setShowConfirmDialog(false);
    setIsConfirmed(true);
    isCheckingRef.current = false;

    setTimeout(() => {
      setIsConfirmed(false);
    }, 10000);
  };

  const handleCloseModal = () => {
    setShowConfirmDialog(false);
    setIsConfirmed(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      checkPendingPackaging();
    }, 600000);

    return () => clearInterval(interval);
  }, [isConfirmed]);

  return (
    <div>
      <Modal
        opened={showConfirmDialog}
        onClose={handleCloseModal}
        title={`Please confirm the Order ${orderNumber} - Status: ${latestOrderStatus}`}
        overlayOpacity={0} 
        overlayColor="transparent" 
        styles={{
          overlay: {
            backgroundColor: 'transparent', 
          },
        }}
      >
        <Button onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal>
      <Drawer
        padding="xl"
        position="right"
        keepMounted={true}
        size={650}
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
                <th>Product Image</th>
                <th>Product</th>
                <th>Product Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
          <Group className="order-detail">
            <Title order={5}>Order Status:</Title>
            <Text>{latestOrderStatus}</Text>
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
    </div>
  );
}

export default OrderDetail;
