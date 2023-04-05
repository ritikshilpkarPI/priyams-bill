import { Button } from '@mantine/core';
import React from 'react';
import { useDisclosure } from '@mantine/hooks';
import '../CSS/_orders.scss';
import OrderDetail from './OrderDetail';
function OrderCard({ order }) {
    const [opened, { open, close }] = useDisclosure(false);
  return (
    <div className="order-card-container" onClick={open} >
      <header>
        <p>New Order</p>
        <p>Slot - {order.timeSlot}</p>
      </header>
      <div>
        <p>Contact Number: {order.contactNumber}</p>
        <p>Address: {order.shippingAddress.address}</p>
        <p>Total Quantity: {order.totalQuantity}</p>
        <p>Payment Info</p>
        <div>
          <p>Total: {order.totalPayableAmount}</p>
          <p>Method: {order.paymentMethod}</p>
        </div>
      </div>
      <div>
        <Button>View Order</Button>
        <Button>Confirm Order</Button>
      </div>
        <OrderDetail opened={opened} close={close}  order={order}/>
    </div>
  );
}

export default OrderCard;
