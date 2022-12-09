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
import EditPurchaseDetail from './EditPurchaseDetail';
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
        setSlabs
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
            <Group position="center">
                <Button onClick={() => setOpened(true)}>Add Order Item</Button>
            </Group>

            <div className='detail-container'>
                <Title order={2}>Purchase Details</Title>
                <Forms purchaseList={purchaseList} purchaseForm={purchaseForm} addPurchadeOrder={addPurchadeOrder} addDetails={addDetails}/>
                <ShowPurchaseDetails deletePurchaseDetail={deletePurchaseDetail} purchaseList={purchaseList} handlePurchaseDetail={handlePurchaseDetail}/>
                <BillUploader purchaseList={purchaseList} setPurchaseList={setPurchaseList}/>
                <Group position="center" mt="">
                        <Button style={{backgroundColor:'#1098AD'}} onClick={addPurchadeOrderValidate} type="submit">Draft</Button>
                        <Button style={{backgroundColor:'#40C057'}} onClick={addPurchadeOrder} type="submit">Save</Button>
                 </Group>
            </div>
            <div>
                <div className='list-items-container'>

                    {
                        orderDetails.length ?
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