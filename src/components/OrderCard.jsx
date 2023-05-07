import { Button } from '@mantine/core';
import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import '../CSS/_orders.scss';
import OrderDetail from './OrderDetail';
function OrderCard({ order, buttonStatus, updateOrderStatus }) {
  const {
    timeSlot,
    paymentMethod,
    shippingAddress,
    contactNumber,
    orderStatus,
    _id,
  } = order || {};
  const [opened, { open, close }] = useDisclosure(false);
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
      />
    </div>
  );
}

export default OrderCard;
