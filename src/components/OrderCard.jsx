import { Button } from '@mantine/core'
import React from 'react'
import '../CSS/_orders.scss'
function OrderCard({order}) {
  return (
    <div className='order-card-container'>
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
    </div>
  )
}

export default OrderCard