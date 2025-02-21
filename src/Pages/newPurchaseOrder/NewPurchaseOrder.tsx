import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DealerDetailForm } from '../../components/dealerDetailForm/DealerDetailForm';
import { Tabs } from '@mantine/core';
import './NewPurchaseOrder.css';
import { useDispatch } from 'react-redux';
import PurchasedItemPanel from 'src/components/purchasedItemPanel/PurchasedItemPanel';
import { getPurchaseOrderDetailsAPI } from 'src/utils/apiUtils';
import { setPurchaseOrder } from 'src/redux/purchaseOrder/purchaseOrderSlice';
import { setDealerFormData } from 'src/redux/dealerDetailForm/dealerDetailFormSlice';
import { PaymentDetailAndBillPanel } from 'src/components/paymentDetailsPanel/PaymentDetailsPanel';

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

  const getPurchaseOrderDetails = async () => {
    if(!purchaseOrderId) return;
    const response = await getPurchaseOrderDetailsAPI(purchaseOrderId);
    if(response?.isError) return;
    const data = response?.data;
    console.log({ response })
    if(!data) return;
    dispatch(setPurchaseOrder(data));
    dispatch(setDealerFormData({
      payment: data.payment,
      billAmount: data.billAmount,
      procurementSource: data.procurementSource,
      dealerName: data.dealerName,
      phoneNumber: data.mobileNumber,
      remark: data.remarks,
    }));
  }

  useEffect(()=> {
    getPurchaseOrderDetails()
  }, [purchaseOrderId])

  return (
    <div style={{ marginTop: "100px", marginBottom: "100px" }}>
      <Tabs value={activeTab} onTabChange={onTabChange}>
        <Tabs.List>
          <Tabs.Tab value={TAB.dealerDetails}>Dealer and Bill Details</Tabs.Tab>
          <Tabs.Tab value={TAB.itemDetails}>Item Details</Tabs.Tab>
          <Tabs.Tab value={TAB.paymentDetails}>Payment Details</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value={TAB.dealerDetails}>
          <DealerDetailForm />
        </Tabs.Panel>
        <Tabs.Panel value={TAB.itemDetails}>
          <PurchasedItemPanel />
        </Tabs.Panel>
        <Tabs.Panel value={TAB.paymentDetails}>
          <PaymentDetailAndBillPanel />
        </Tabs.Panel>
     </Tabs>
    </div>
  )
}

export default NewPurchaseOrder;