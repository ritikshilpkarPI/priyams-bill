import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { addNewOrderAPI, saveOrderAPI } from '../../utils/apiUtils';
import { DealerDetailForm } from '../../components/dealerDetailForm/DealerDetailForm';
import { Tabs } from '@mantine/core';
import './NewPurchaseOrder.css';
import { PurchasedItemDetailForm } from 'src/components/PurchasedItemDetailForm/PurchasedItemDetailForm';

const NewPurchaseOrder = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
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
  const onPurchasedOrderSubmit = async (purchaseItemDetails: any) => {
    const response = await saveOrderAPI({ ...purchaseItemDetails, inputName: purchaseItemDetails.itemName });
    console.log({ response })
  }
  const onTabChange = (newTab: string) => {
    setActiveTab(newTab);
    navigate(`${location.pathname}?tab=${newTab}`);
  }
  return (
    <div style={{ marginTop: "100px" }}>
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
        </Tabs.Panel>
        <Tabs.Panel value={TAB.paymentDetails}>Third panel</Tabs.Panel>
     </Tabs>
      {/* NewPurchaseOrder */}
      {/* <DealerDetailForm onSubmit={onDealerFormSubmit}/> */}
    </div>
  )
}

export default NewPurchaseOrder;