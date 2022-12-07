import React from 'react'
import { Button, Group, Box, Textarea, NumberInput, Select, Table, Title, TextInput } from '@mantine/core';
import usePurchaseOrder from 'src/functions/usePurchaseOrder';
import OrderForm from './OrderForm';
import useNameSearchItem from 'src/functions/useNameSearchItems';
import useBarcodeSearchItems from 'src/functions/useBarcodeSearchItems';
import { FileInput } from '@mantine/core';

import {ReceiptPreview} from './ReceiptPreview'
import BillUpoloader from './BillUpoloader';
const PurchaseOrderItems = ({ history }) => {
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
        setOrderDetails,
        handleSelectOrderItems,
        openDrawer,
        setOpenDrawer,
        expiryQuantity,
        setExpiryQuantity,
        addPurchadeOrder,
        handleDateDelete,
        orderList,
        setOrderList,
    } = usePurchaseOrder(history)

    const {
        filterItems
    } = useNameSearchItem(form.values.inputName)
    return (
        <>

            <OrderForm 
            openDrawer = {openDrawer} 
            expiryQuantity={expiryQuantity} 
            handleDateDelete={handleDateDelete}
             setExpiryQuantity={setExpiryQuantity} 
             setOpenDrawer={setOpenDrawer} 
             setOpened={setOpened} 
             handleItemFrom={handleItemFrom} 
             form={form} 
             opened={opened} 
             handleExpiryDate={handleExpiryDate} 
             setDate={setDate} 
             date={date} 
             filterItems={filterItems} 
             handleSelectOrderItems={handleSelectOrderItems}
             
            />
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
                            value={orderDetails.payment == 'credit'?'credit':orderDetails.billAmount <= orderDetails.paidAmount ? 'fullypaid':'partiallypaid'}
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
                        <Select
                            label="Procurement Source"
                            placeholder='pick one'
                            required
                            data={[
                                { value: 'walmart', label: 'Walmart' },
                                { value: 'dmart', label: 'D Mart' },
                                { value: 'city', label: 'City' },
                                { value: 'distributor', label: 'Distributor' },
                            ]}
                            onChange={(value) => setOrderDetails((prev) => ({
                                ...prev,
                                procurementSource: value,
                            }))}
                        />
                        <TextInput
                            withAsterisk
                            required
                            label="Dealer Name"
                            placeholder="dealer name"
                            onChange={(e) => setOrderDetails((prev) => ({
                                ...prev,
                                dealerName: e.target.value,
                            }))}
                        />
                        <NumberInput
                            withAsterisk
                            label="Mobile Number"
                            placeholder="mobile number"
                            formatter={(value) => String(value).length <= 10 ? value : String(value).substring(0,10)}
                            onChange={(value) => {    
                                if(String(value).length <= 10){
                                    setOrderDetails((prev) => ({
                                        ...prev,
                                        phoneNumber: value,
                                    }))
                                }                      
                            }}
                        />
                        {
                            orderDetails.paidBy === "cheque" &&
                            <NumberInput
                                withAsterisk
                                required
                                label="Cheque number"
                                placeholder="checque number"
                                onChange={(value) => setOrderDetails((prev) => ({
                                    ...prev,
                                    chequeNumber: value,
                                }))}
                            />
                        }
                    </Group>
                    <Textarea
                        sx={{ width: "60%", marginTop: "1rem" }}
                        placeholder="remarks"
                        label="Your Remarks"
                        value={orderDetails.remark}
                        onChange={(e) => setOrderDetails((prev) => ({
                            ...prev,
                            remark: e.target.value,
                        }))}
                    />
                    {/* <AddReceipt orderList={orderList} setOrderList={setOrderList}/> */}
                    <BillUpoloader  />
                    <ReceiptPreview orderList={orderList}/>
                    <Group position="right" mt="md">
                        <Button onClick={addPurchadeOrder} type="submit">Submit</Button>
                    </Group>
                </Box>
            </div>
            <div>
                <div className='list-items-container'>

                    {
                        orderDetails.purchasedItems.length ?
                            <Table withColumnBorders striped withBorder>
                                <thead>
                                    <tr>
                                        <th>Barcode</th>
                                        <th>Item name</th>
                                        <th>Stock Quantity</th>
                                        <th>Minimum Quantity</th>
                                        <th>Item Quantity</th>
                                        <th>Unit</th>
                                        <th>Selling Price</th>
                                        <th>MRP</th>
                                        <th>Cost Price</th>
                                        <th>Expiry Dates</th>
                                        <th>Update</th>
                                    </tr>
                                </thead>
                                <tbody>{rows}</tbody>
                            </Table> : <div></div>
                    }

                </div>

            </div>
        </>
    );


}

export default PurchaseOrderItems;