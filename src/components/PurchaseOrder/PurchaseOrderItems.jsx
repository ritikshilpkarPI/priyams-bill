import React ,{useEffect} from 'react'
import { Button, Group, Box, Textarea, NumberInput, Select, Table, Title, TextInput } from '@mantine/core';
import usePurchaseOrder from 'src/functions/usePurchaseOrder';
import OrderForm from './OrderForm';
import useNameSearchItem from 'src/functions/useNameSearchItems';
import useBarcodeSearchItems from 'src/functions/useBarcodeSearchItems';
import { FileInput } from '@mantine/core';

import BillUploader from './BillUploader';
import ShowPurchaseDetails from './ShowPurchaseDetails';
import Forms from './Forms';
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
        PurchaseList,
        purchaseForm,
        addDetails
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
                <Forms PurchaseList={PurchaseList} purchaseForm={purchaseForm} addPurchadeOrder={addPurchadeOrder} addDetails={addDetails}/>
                <Group position="right" mt="md">
                        <Button  type="submit">Submit</Button>
                 </Group>
            </div>
                   <BillUploader PurchaseList={PurchaseList}/>
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