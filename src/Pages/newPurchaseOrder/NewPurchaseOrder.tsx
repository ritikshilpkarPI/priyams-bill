import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DealerDetailForm } from '../../components/dealerDetailForm/DealerDetailForm';
import { Tabs, Title } from '@mantine/core';
import './NewPurchaseOrder.css';
import { useDispatch } from 'react-redux';
import PurchasedItemPanel from 'src/components/purchasedItemPanel/PurchasedItemPanel';
import { getPurchaseOrderDetailsAPI } from 'src/utils/apiUtils';
import { setPurchaseOrder } from 'src/redux/purchaseOrder/purchaseOrderSlice';
import { setDealerFormData } from 'src/redux/dealerDetailForm/dealerDetailFormSlice';
import { PaymentDetailAndBillPanel } from 'src/components/paymentDetailsPanel/PaymentDetailsPanel';
import { BillUploadPanel } from 'src/components/BillUploadPanel/BillUploadPanel';

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
    paymentDetails: "paymentDetails",
    billUpload: "billUpload"
  }
  const [activeTab, setActiveTab] = useState<any>(TAB[searchParams.get('tab')] || 'dealerDetails');

  const onTabChange = (newTab: string) => {
    setActiveTab(newTab);
    navigate(`${location.pathname}?tab=${newTab}`);
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
      <Title order={2}>Purchase Order</Title>
      <Tabs variant="default" color="black" value={activeTab} onTabChange={onTabChange}>
        <Tabs.List grow>
          <Tabs.Tab color="blue" value={TAB.dealerDetails}>Dealer Details</Tabs.Tab>
          <Tabs.Tab value={TAB.itemDetails}>Item Details</Tabs.Tab>
          <Tabs.Tab value={TAB.paymentDetails}>Payment Details</Tabs.Tab>
          <Tabs.Tab value={TAB.billUpload}>Bill Upload</Tabs.Tab>
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
        <Tabs.Panel value={TAB.billUpload}>
          <BillUploadPanel />
        </Tabs.Panel>
     </Tabs>
    </div>
  )
}

export default NewPurchaseOrder;