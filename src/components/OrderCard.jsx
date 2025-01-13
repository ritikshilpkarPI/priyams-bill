import { Button, Group, Text, Title } from '@mantine/core';
import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import '../CSS/_orders.scss';
import OrderDetail from './OrderDetail';
function OrderCard({ order, buttonStatus, updateOrderStatus,getUserOrders }) {
  const {
    timeSlot,
    paymentMethod,
    shippingAddress,
    contactNumber,
    orderStatus,
    _id,
    orderCreatedAt
  } = order || {};
  const [opened, { open, close }] = useDisclosure(false);
  const orderPlacedDate = new Date(orderCreatedAt).toLocaleString('en-IN');

  return (
    <div className="order-card-container">
      <div className="order-card-info-container" onClick={open}>
        <div className="slot-method-container">
          <p className="delivery-slot">Slot: {timeSlot || '-'}</p>
          <p className="payment-method">Method: {paymentMethod || '-'}</p>
        </div>
        <div className="address-container">
          <p>
            <span>Address:</span> {shippingAddress?.address || '-'}
          </p>
          <p className="address-contact">
            {' '}
            <span>Contact:</span> {contactNumber || '-'}
          </p>
          <Group className="order-card">
            <Title className='order-card-date-time-label' order={5}>Date:</Title>
            <Text className='order-card-date-time'>{ orderPlacedDate }</Text>
          </Group>
          {order?.rider && <div className="rider-details-container-label">
            Rider Details
          </div>}
          {order?.rider?.name && <Group className="order-card">
            <Title className='order-card-date-time-label' order={5}>Name:</Title>
            <Text className='order-card-date-time'>{ order?.rider?.name }</Text>
          </Group>}
          {
            order?.rider?.phone && <Group className="order-card">
            <Title className='order-card-date-time-label' order={5}>Phone:</Title>
            <Text className='order-card-date-time'>{ order?.rider?.phone }</Text>
          </Group>
          }
        </div>
      </div>
      {buttonStatus && (
        <div className="confirm-order-btn-container">
          <Button
            onClick={() => {
              updateOrderStatus(
                orderStatus?.[orderStatus?.length - 1]?.step,
                _id,
                buttonStatus
              );
            }}
            color="teal"
            className="confirm-order-btn"
          >
            {buttonStatus}
          </Button>
        </div>
      )}

      <OrderDetail
        opened={opened}
        close={close}
        order={order}
        buttonStatus={buttonStatus}
        updateOrderStatus={updateOrderStatus}
        getUserOrders={getUserOrders}
      />
    </div>
  );
}

export default OrderCard;
