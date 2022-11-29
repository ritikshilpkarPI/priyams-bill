import React, { useState, useEffect } from 'react'
import { Drawer, Button, Group, Box, TextInput, Textarea, NumberInput, Select, FileInput, Table } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import usePurchaseOrder from 'src/functions/usePurchaseOrder';
import OrderForm from './OrderForm';


const PurchaseOrderItems = () => {
    const {
        form,
        rows,
        opened,
        orderDetails,
        setOpened,
        handleItemFrom,
        handleExpiryDate,
        setDate,
        date
    } = usePurchaseOrder()
    return (
        <>

            <OrderForm handleItemFrom={handleItemFrom} form={form} setOpened={setOpened} opened={opened} handleExpiryDate={handleExpiryDate} setDate={setDate} date={date} />
            <Group position="center">
                <Button onClick={() => setOpened(true)}>Open Drawer</Button>
            </Group>
            {
                orderDetails.items.length ?
                    <Table width={"100%"}>
                        <thead>
                            <tr>
                                <th>Barcode</th>
                                <th>Item name</th>
                                <th>Stock Quantity</th>
                                <th>Minimum Quantity</th>
                                <th>Item Quantity</th>
                                <th>Unit</th>
                                <th>Procurement Source</th>
                                <th>Dealer Name</th>
                                <th>Phone Number</th>
                                <th>Selling Price</th>
                                <th>MRP</th>
                                <th>Cost Price</th>
                                <th>Expiry Dates</th>
                            </tr>
                        </thead>
                        <tbody>{rows}</tbody>
                    </Table> : ''
            }

        </>
    );


}

export default PurchaseOrderItems;