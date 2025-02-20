import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DealerDetailForm } from '../../components/dealerDetailForm/DealerDetailForm';
import { Tabs } from '@mantine/core';
import './NewPurchaseOrder.css';
import { useDispatch } from 'react-redux';
import PurchasedItemPanel from 'src/components/purchasedItemPanel/PurchasedItemPanel';

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
  


  const onTabChange = (newTab: string) => {
    setActiveTab(newTab);
    navigate(`${location.pathname}?tab=${newTab}`);
  }

  const onPurchasedOrderSubmit = () => {

  }

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
          <PurchasedItemPanel />
        </Tabs.Panel>
        <Tabs.Panel value={TAB.paymentDetails}>Third panel</Tabs.Panel>
     </Tabs>
    </div>
  )
}

export default NewPurchaseOrder;