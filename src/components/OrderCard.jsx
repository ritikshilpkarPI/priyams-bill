import { Button } from '@mantine/core';
import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import '../CSS/_orders.scss';
import OrderDetail from './OrderDetail';
function OrderCard({ order, buttonStatus, updateOrderStatus }) {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <div className="order-card-container">
      <div className="order-card-info-container" onClick={open}>
        <div className="slot-method-container">
          <p className="delivery-slot">Slot: {order?.timeSlot || '-'}</p>
          <p className="payment-method">
            Method: {order?.paymentMethod || '-'}
          </p>
        </div>
        <div className="address-container">
          <p>
            <span>Address:</span> {order?.shippingAddress?.address || '-'}
          </p>
          <p className="address-contact">
            {' '}
            <span>Contact:</span> {order?.contactNumber || '-'}
          </p>
        </div>
      </div>
      {buttonStatus && (
        <div className="confirm-order-btn-container">
          <Button
            onClick={() => {
              updateOrderStatus(
                order?.orderStatus?.[order?.orderStatus?.length - 1]?.step,
                order?._id,
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
