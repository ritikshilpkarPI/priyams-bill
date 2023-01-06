import React from 'react'
import { Button, Group, LoadingOverlay, Title } from '@mantine/core';
import { Notification } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons';
import usePurchaseOrder from 'src/functions/usePurchaseOrder';
import OrderForm from './OrderForm';
import useNameSearchItem from 'src/functions/useNameSearchItems';
import useBarcodeSearchItems from 'src/functions/useBarcodeSearchItems';
import ShowPurchaseDetails from './ShowPurchaseDetails';
import Forms from './Forms';
import EditPurchaseDetail from './EditPurchaseDetail';
import ShowOrderDetail from './ShowOrderDetail';
import '../../CSS/purchaseOrder.css'
import { useHistory, useParams } from "react-router-dom";
const PurchaseOrderItems = ({ history }) => {
    const {
        form,
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
        handleItemEdit,
        deleteOrder,
        cloudBills,
        deleteCloudBills,
        Loading
    } = usePurchaseOrder(history)

    const {
        filterItems
    } = useNameSearchItem(form.values.inputName)
    //my code for work-
    const {
        filterItems2
    } = useBarcodeSearchItems(form.values.barcode)
    const locate = useHistory();
    const { id } = useParams();
    return (
        <>
            <div className="back-button-purchase">
                <Button className="back-button" disabled={id?false:true} onClick={()=> locate.push('/approval')}>
                    Back
                </Button>
            </div>
            <LoadingOverlay className='purchase-loader' visible={Loading} overlayBlur={1} />

            <OrderForm
                openDrawer={openDrawer}
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
                filterItems2={filterItems2}
                handleSelectOrderItems={handleSelectOrderItems}
                slabForm={slabForm}
                addSlabPrice={addSlabPrice}
                deleteSlab={deleteSlab}
                slabs={slabs}
                setSlabs={setSlabs}
            />
            <EditPurchaseDetail
                openPurchaseDrawer={openPurchaseDrawer}
                setPurchaseDrawer={setPurchaseDrawer}
                updateDetails={updateDetails}
                purchaseForm={purchaseForm}
            />
            <Notification style={{ display: message.success ? "flex" : "none", width: '50vmin', height: "10vmin" }} onClose={() => { setMessage({ success: false, failed: false }) }} icon={<IconCheck size={18} />} color="teal" title={message.status}>
                Purchase Details saved successfully
            </Notification>
            <Notification style={{ display: message.failed ? "flex" : "none", width: '50vmin', height: "10vmin" }} onClose={() => { setMessage({ success: false, failed: false }) }} icon={<IconX size={18} />} color="red" title="Failed, cannot save details">
                {message.error}
            </Notification>
            <Group position="center">
                <Button style={{ backgroundColor: '#1098AD' }} onClick={addPurchadeOrderValidate} type="submit" disabled={purchaseList.isDraft === false}>Draft</Button>
                <Button style={{ backgroundColor: '#40C057' }} onClick={() => { addPurchadeOrder(false) }} type="submit">Save</Button>
            </Group>
            <Group position="center" style={{ marginTop: '5vmin' }}>
                <Button onClick={() => setOpened(true)}>Add Item</Button>
            </Group>




            <div className='detail-container'>
                <ShowOrderDetail purchaseList={purchaseList} handleItemEdit={handleItemEdit} deleteOrder={deleteOrder} />
                <Title order={3}>Payment Details</Title>
                <Forms purchaseList={purchaseList} setPurchaseList={setPurchaseList} cloudBills={cloudBills} deleteCloudBills={deleteCloudBills} purchaseForm={purchaseForm} addPurchadeOrder={addPurchadeOrder} addDetails={addDetails} />
                <ShowPurchaseDetails deletePurchaseDetail={deletePurchaseDetail} purchaseList={purchaseList} handlePurchaseDetail={handlePurchaseDetail} />

            </div>
            <div>
                <div className='list-items-container'>
                </div>

            </div>
        </>
    );


}

export default PurchaseOrderItems;