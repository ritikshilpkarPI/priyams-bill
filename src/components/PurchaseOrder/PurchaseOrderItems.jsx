import React ,{useEffect} from 'react'
import { Button, Group, Box, Textarea, NumberInput, Select, Table, Title, TextInput } from '@mantine/core';
import { Notification } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons';
import usePurchaseOrder from 'src/functions/usePurchaseOrder';
import OrderForm from './OrderForm';
import useNameSearchItem from 'src/functions/useNameSearchItems';
import useBarcodeSearchItems from 'src/functions/useBarcodeSearchItems';
import { FileInput } from '@mantine/core';

import BillUploader from './BillUploader';
import ShowPurchaseDetails from './ShowPurchaseDetails';
import Forms from './Forms';
import EditPurchaseDetail from './EditPurchaseDetail';
const PurchaseOrderItems = ({ history }) => {
    const {
        form,
        rows,
        opened,
        setOpened,
        handleItemFrom,
        handleExpiryDate,
        setDate,
        date,
        handleSelectOrderItems,
        openDrawer,
        setOpenDrawer,
        expiryQuantity,
        setExpiryQuantity,
        addPurchadeOrder,
        handleDateDelete,
        orderList,
        setOrderList,
        purchaseList,
        setPurchaseList,
        purchaseForm,
        addDetails,
        handlePurchaseDetail,
        openPurchaseDrawer,
        setPurchaseDrawer,
        updateDetails,
        addPurchadeOrderValidate,
        deletePurchaseDetail,
        slabForm,
        addSlabPrice,
        deleteSlab,
        slabs,
        setSlabs,
        message,
        setMessage,
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
             slabForm={slabForm}
             addSlabPrice={addSlabPrice}
             deleteSlab={deleteSlab}
             slabs={slabs}
             setSlabs={setSlabs}
            />
            <EditPurchaseDetail
            openPurchaseDrawer ={openPurchaseDrawer}
            setPurchaseDrawer = {setPurchaseDrawer}
            updateDetails={updateDetails}
            purchaseForm ={purchaseForm}
             />
            <Notification style={{display:message.success?"flex":"none",width:'50vmin',height:"10vmin"}}  onClose={()=>{setMessage({success:false,failed:false})}} icon={<IconCheck size={18} />} color="teal" title={message.status}>
                Purchase Details saved successfully
            </Notification>
            <Notification style={{display:message.failed?"flex":"none",width:'50vmin',height:"10vmin"}} onClose={()=>{setMessage({success:false,failed:false})}} icon={<IconX size={18} />} color="red" title="Failed, cannot save details">
                {message.error}
            </Notification>
            <Group position="center">
                <Button onClick={() => setOpened(true)}>Add Order Item</Button>
            </Group>

            <div className='detail-container'>
                <Title order={2}>Purchase Details</Title>
                <Forms purchaseList={purchaseList} purchaseForm={purchaseForm} addPurchadeOrder={addPurchadeOrder} addDetails={addDetails}/>
                <ShowPurchaseDetails deletePurchaseDetail={deletePurchaseDetail} purchaseList={purchaseList} handlePurchaseDetail={handlePurchaseDetail}/>
                <BillUploader purchaseList={purchaseList} setPurchaseList={setPurchaseList} />
                <Group position="center" mt="">
                        <Button style={{backgroundColor:'#1098AD'}} onClick={addPurchadeOrderValidate} type="submit">Draft</Button>
                        <Button style={{backgroundColor:'#40C057'}} onClick={()=>{addPurchadeOrder(false)}} type="submit">Save</Button>
                 </Group>
            </div>
            <div>
                <div className='list-items-container'>

                    {
                        purchaseList.orders.length ?
                       <>
                        <h3 style={{margin:'2vmin'}}>Order Detail List</h3>
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
                            </Table>
                       </> : <div></div>
                    }

                </div>

            </div>
        </>
    );


}

export default PurchaseOrderItems;