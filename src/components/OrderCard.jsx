import { Button } from '@mantine/core';
import React from 'react';
import '../CSS/_orders.scss';
function OrderCard({ order }) {
  return (
    <div className="order-card-container">
      <div className="order-card-info-container">
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
    </div>
  );
}

export default OrderCard;
