import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { addNewOrderAPI, getPurchaseOrderDetailsAPI, saveOrderAPI, updatePurchaseOrderByIdAPI } from '../../utils/apiUtils';
import { DealerDetailForm } from '../../components/dealerDetailForm/DealerDetailForm';
import { Tabs } from '@mantine/core';
import './NewPurchaseOrder.css';
import { PurchasedItemDetailForm } from 'src/components/PurchasedItemDetailForm/PurchasedItemDetailForm';
import { useDispatch } from 'react-redux';
import { addPurchasedItem, setPurchaseOrder } from '../../redux/purchaseOrder/purchaseOrderSlice';
import { PurchasedItemTable } from '../../components/purchasedItemTable/PurchasedItemTable';

const NewPurchaseOrder = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const params = useParams();
  const purchaseOrderId = params?.id;
  const dispatch = useDispatch();
  const searchParams: any = new URLSearchParams(location.search);
  const TAB:any = {
    dealerDetails: "dealerDetails",
    itemDetails: "itemDetails",
    paymentDetails: "paymentDetails"
  }
  console.log({ tab: searchParams.tab })
  const [activeTab, setActiveTab] = useState<any>(TAB[searchParams.get('tab')] || 'dealerDetails');
  const saveDealerDetails = async () => {
    // addNewOrderAPI();
  }
  const onPurchasedOrderSubmit = (purchaseItemDetails: any) => {
    if(!purchaseOrderId) return onSavePurchaseOrderItem(purchaseItemDetails);
    return onUpdatePurchaseOrderItem(purchaseItemDetails)
  }

  const onSavePurchaseOrderItem = async(purchaseItemDetails: PurchasedItemDetailFormType) => {
    const response = await saveOrderAPI({ 
      ...purchaseItemDetails, 
      inputName: purchaseItemDetails.itemName 
    });
    if(response.isError) return;
    navigate(`${location.pathname}/${response?.order._id}${location.search}`)
  }

  const onUpdatePurchaseOrderItem = async(purchasedItemData: PurchasedItemDetailFormType) => {
    if(!purchaseOrderId) return;
    const response = await updatePurchaseOrderByIdAPI(purchasedItemData, purchaseOrderId);
    if(response.isError) return;
    dispatch(addPurchasedItem(purchasedItemData))
  }

  const onTabChange = (newTab: string) => {
    setActiveTab(newTab);
    navigate(`${location.pathname}?tab=${newTab}`);
  }
// 67b6d2398a7c30b6f3c31bfc
  const getPurchaseOrderDetails = async () => {
    
    if(!purchaseOrderId) return;

    const response = await getPurchaseOrderDetailsAPI(purchaseOrderId);
   if(response?.data)  dispatch(setPurchaseOrder(response.data))
  }

  useEffect(()=> {
    if(activeTab === TAB.itemDetails && purchaseOrderId){
      getPurchaseOrderDetails()
    }
  }, [activeTab])

  return (
    <div style={{ marginTop: "100px", marginBottom: "100px" }}>
      <Tabs value={activeTab} onTabChange={onTabChange}>
        <Tabs.List>
          <Tabs.Tab value={TAB.dealerDetails}>Dealer and Bill Details</Tabs.Tab>
          <Tabs.Tab value={TAB.itemDetails}>Item Details</Tabs.Tab>
          <Tabs.Tab value={TAB.paymentDetails}>Payment Details</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value={TAB.dealerDetails}>
          <DealerDetailForm onSubmit={onPurchasedOrderSubmit}/>
        </Tabs.Panel>
        <Tabs.Panel value={TAB.itemDetails}>
          <PurchasedItemDetailForm onSubmit={onPurchasedOrderSubmit} />
          <PurchasedItemTable />
        </Tabs.Panel>
        <Tabs.Panel value={TAB.paymentDetails}>Third panel</Tabs.Panel>
     </Tabs>
      {/* NewPurchaseOrder */}
      {/* <DealerDetailForm onSubmit={onDealerFormSubmit}/> */}
    </div>
  )
}

export default NewPurchaseOrder;