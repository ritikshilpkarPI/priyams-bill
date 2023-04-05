import { Button } from '@mantine/core';
import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import '../CSS/_orders.scss';
import OrderDetail from './OrderDetail';
function OrderCard({ order }) {
    const [opened, { open, close }] = useDisclosure(false);
  return (
    <div className="order-card-container">
      <div className="order-card-info-container" onClick={open}>
        <div className="slot-method-container">
          <p className="delivery-slot">Slot - {order.timeSlot}</p>
          <p className="payment-method">Method: {order.paymentMethod}</p>
        </div>
        <div className="address-container">
          <p>
            Address: Ward number 15, 143-C asmaan apartment, indrapuri sector-c,
            bhopal {order.shippingAddress.address}
          </p>
          <p className='address-contact'>Contact: 9777564545</p>
        </div>
      </div>
      <div className="confirm-order-btn-container">
        <Button className="confirm-order-btn">Confirm Order</Button>
      </div>
        <OrderDetail opened={opened} close={close}  order={order}/>
    </div>
  );
}

export default OrderCard;
