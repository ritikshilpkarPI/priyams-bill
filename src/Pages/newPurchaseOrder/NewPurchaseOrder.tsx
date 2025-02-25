import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DealerDetailForm } from '../../components/dealerDetailForm/DealerDetailForm';
import { Tabs, Title } from '@mantine/core';
import './NewPurchaseOrder.css';
import { useDispatch } from 'react-redux';
import PurchasedItemPanel from '../../components/purchasedItemPanel/PurchasedItemPanel';
import { getPurchaseOrderDetailsAPI } from '../../utils/apiUtils';
import { resetPurchaseOrder, setPurchaseOrder } from '../../redux/purchaseOrder/purchaseOrderSlice';
import { resetDealerForm, setDealerFormData } from '../../redux/dealerDetailForm/dealerDetailFormSlice';
import { PaymentDetailAndBillPanel } from '../../components/paymentDetailsPanel/PaymentDetailsPanel';
import { BillUploadPanel } from '../../components/BillUploadPanel/BillUploadPanel';
import { PurchaseOrderSummary } from '../../components/purchaseOrderSummary/PurchaseOrderSummary';
import { resetPurchasedItemForm } from '../../redux/purchasedItemDetailForm/purchasedItemDetailFormSlice';
import { toast } from "react-toastify";

const NewPurchaseOrder = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const params = useParams();
  const purchaseOrderId = params?.id;
  const dispatch = useDispatch();
  const searchParams: any = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab');
  const TAB:any = {
    dealerDetails: "dealerDetails",
    itemDetails: "itemDetails",
    paymentDetails: "paymentDetails",
    billUpload: "billUpload",
    summary: "summary",
  }
  const [activeTab, setActiveTab] = useState<any>(TAB[currentTab] || 'dealerDetails');

  const onTabChange = (newTab: string) => {
    setActiveTab(newTab);
    navigate(`${location.pathname}?tab=${newTab}`);
  }

  const getPurchaseOrderDetails = async () => {
    if(!purchaseOrderId) return;
    const response = await getPurchaseOrderDetailsAPI(purchaseOrderId);
    if(response?.isError || !response.data) {
      toast.error('unable to get details of this purchase order, please try again')
      return;
    };
    const data = response?.data;
    if(!data) return;
    dispatch(setPurchaseOrder(data));
    dispatch(setDealerFormData({
      payment: data.payment,
      billAmount: data.billAmount,
      procurementSource: data.procurementSource,
      dealerName: data.dealerName,
      phoneNumber: data.phoneNumber,
      remark: data.remark,
    }));
  }

  const resetPurchaseOrderForms = () => {
    dispatch(resetDealerForm());
    dispatch(resetPurchasedItemForm());
    dispatch(resetPurchaseOrder());
  }

  useEffect(()=> {
    if(purchaseOrderId)  getPurchaseOrderDetails();
    else resetPurchaseOrderForms();
  }, [purchaseOrderId])

  useEffect(()=> {
    setActiveTab(TAB[currentTab] || 'dealerDetails');
  }, [currentTab])

  return (
    <div style={{ marginTop: "16px", marginBottom: "16px" }}>
      <Title order={2}>Purchase Order</Title>
      <Tabs variant="default" color="black" value={activeTab} onTabChange={onTabChange}>
        <Tabs.List grow>
          <Tabs.Tab color="blue" value={TAB.dealerDetails}>Dealer Details</Tabs.Tab>
          <Tabs.Tab value={TAB.itemDetails}>Item Details</Tabs.Tab>
          <Tabs.Tab value={TAB.paymentDetails}>Payment Details</Tabs.Tab>
          <Tabs.Tab value={TAB.billUpload}>Bill Images</Tabs.Tab>
          <Tabs.Tab value={TAB.summary}>Summary & Action</Tabs.Tab>
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
        <Tabs.Panel value={TAB.summary}>
          <PurchaseOrderSummary />
        </Tabs.Panel>
     </Tabs>
    </div>
  )
}

export default NewPurchaseOrder;