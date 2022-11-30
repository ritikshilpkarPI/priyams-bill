import React from 'react'
import { Button, Group, Box, Textarea, NumberInput, Select, Table, Title } from '@mantine/core';
import usePurchaseOrder from 'src/functions/usePurchaseOrder';
import OrderForm from './OrderForm';
import useNameSearchItem from 'src/functions/useNameSearchItems';


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
        date,
        setOrderDetails
    } = usePurchaseOrder()
    // let searchWord = form.values.inputName
    // console.log({ searchWord });
    const {
        itemsList,
        filterItems
    } = useNameSearchItem(form.values.inputName)

    console.log({ filterItems });
    return (
        <>

            <OrderForm handleItemFrom={handleItemFrom} form={form} setOpened={setOpened} opened={opened} handleExpiryDate={handleExpiryDate} setDate={setDate} date={date} filterItems={filterItems} />
            <Group position="center">
                <Button onClick={() => setOpened(true)}>Add Order Item</Button>
            </Group>

            <div className='detail-container'>
                <Title order={2}>Purchase Details</Title>
                <Box sx={{ maxWidth: "80%" }} mx="auto">
                    <Group>
                        <Select
                            label="Payment"
                            placeholder='pick one payment option'
                            data={[
                                { value: 'fullypaid', label: 'Fully Paid' },
                                { value: 'partiallypaid', label: 'Partially Paid' },
                                { value: 'credit', label: 'Credit' },
                            ]}
                            value={orderDetails.payment}
                            onChange={(value) => setOrderDetails((prev) => ({
                                ...prev,
                                payment: value,
                            }))}
                        />

                        <NumberInput
                            withAsterisk
                            label="Bill Amount"
                            placeholder="total bill amount"
                            value={orderDetails.billAmount}
                            onChange={(value) => setOrderDetails((prev) => ({
                                ...prev,
                                billAmount: value,
                            }))}
                        />
                        <Select
                            label="Paid by"
                            placeholder='pick one'
                            data={[
                                { value: 'cash', label: 'cash' },
                                { value: 'upi', label: 'UPI' },
                                { value: 'cheque', label: 'Cheque' },
                                { value: 'prepaid', label: 'Prepaid' },
                                { value: 'neft', label: 'NEFT' },
                            ]}
                            value={orderDetails.paidBy}
                            onChange={(value) => setOrderDetails((prev) => ({
                                ...prev,
                                paidBy: value,
                            }))}
                        />
                        <NumberInput
                            withAsterisk
                            label="Paid Amount"
                            placeholder="total paid amount"
                            value={orderDetails.paidAmount}
                            onChange={(value) => setOrderDetails((prev) => ({
                                ...prev,
                                paidAmount: value,
                            }))}
                        />
                    </Group>
                    <Textarea
                        sx={{ width: "60%", marginTop: "1rem" }}
                        placeholder="remarks"
                        label="Your Remarks"
                        value={orderDetails.remark}
                        onChange={(value) => setOrderDetails((prev) => ({
                            ...prev,
                            remark: value,
                        }))}
                    />


                    <Group position="right" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </Box>
            </div>

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