import {  Drawer } from '@mantine/core'
import React from 'react'

function OrderDetail({order, opened, close}) {
  return (
    <Drawer padding="xl"
    position='right'
    keepMounted={true}
    size={400}  opened={opened} onClose={close} title={`${order.contactNumber} Order Details`}>
        <p>Contact Number - {order.contactNumber}</p>
        <p>Order Date - {order.orderDate}</p>
        <p>Order Number - {order.orderNumber}</p>
        <p>orderStatus - {order.orderStatus?.value}</p>
        <p>Payment Id - {order.paymentId}</p>
        <p>paymentMethod - {order.paymentMethod}</p>
        <p>totalPayableAmount - {order.totalPayableAmount}</p>
    </Drawer>
  )
}

export default OrderDetail