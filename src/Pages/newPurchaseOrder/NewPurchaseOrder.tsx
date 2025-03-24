import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DealerDetailForm } from '../../components/dealerDetailForm/DealerDetailForm';
import { Chip, Group, LoadingOverlay, Tabs, Title } from '@mantine/core';
import './NewPurchaseOrder.css';
import { useDispatch, useSelector } from 'react-redux';
import PurchasedItemPanel from '../../components/purchasedItemPanel/PurchasedItemPanel';
import { getPurchaseOrderDetailsAPI } from '../../utils/apiUtils';
import {
  resetPurchaseOrder,
  setPurchaseOrder,
} from '../../redux/purchaseOrder/purchaseOrderSlice';
import {
  resetDealerForm,
  setDealerFormData,
} from '../../redux/dealerDetailForm/dealerDetailFormSlice';
import { PaymentDetailAndBillPanel } from '../../components/paymentDetailsPanel/PaymentDetailsPanel';
import { BillUploadPanel } from '../../components/BillUploadPanel/BillUploadPanel';
import { PurchaseOrderSummary } from '../../components/purchaseOrderSummary/PurchaseOrderSummary';
import { resetPurchasedItemForm } from '../../redux/purchasedItemDetailForm/purchasedItemDetailFormSlice';
import { toast } from 'react-toastify';
import {
  validateDealerDetails,
  validateItemDetails,
  validatePaymentDetails,
} from 'src/utils/purchaseOrderValidations';
import { selectPurchaseOrder } from 'src/redux/purchaseOrder/purchaseOrderSelectors';
import { TAB, TabChip, TabKey } from 'src/components/TabChip';



const NewPurchaseOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const purchaseOrderId = params?.id;
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  
  const currentTab = searchParams.get('tab')  || "";
  const activeTabInitial = currentTab && currentTab in TAB ? TAB[currentTab] : TAB.dealerDetails;

  const [loading, setLoading] = useState(false);
  const [isValidDealerDetails, setIsValidDealerDetails] = useState(false);
  const [isValidItemDetails, setIsValidItemDetails] = useState(false);
  const [isValidPaymentDetails, setIsValidPaymentDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(activeTabInitial);

  const purchaseOrder = useSelector(selectPurchaseOrder);
  const isBillImagesUploaded = Boolean(purchaseOrder?.billPhotos?.length);
  const onTabChange = (newTab: TabKey) => {
    setActiveTab(TAB[newTab]);
    navigate(`${location.pathname}?tab=${newTab}`);
  };

  const getPurchaseOrderDetails = async () => {
    if (!purchaseOrderId) return;
    setLoading(true);
    const response = await getPurchaseOrderDetailsAPI(purchaseOrderId);
    setLoading(false);
    if (response?.isError || !response.data) {
      toast.error('Unable to get details of this purchase order, please try again');
      return;
    }
    const data = response?.data;
    if (!data) return;
    dispatch(setPurchaseOrder(data));
    dispatch(
      setDealerFormData({
        payment: data.payment,
        billAmount: data.billAmount,
        procurementSource: data.procurementSource,
        dealerName: data.dealerName,
        phoneNumber: data.phoneNumber,
        remark: data.remark,
      })
    );
  };

  const resetPurchaseOrderForms = () => {
    dispatch(resetDealerForm());
    dispatch(resetPurchasedItemForm());
    dispatch(resetPurchaseOrder());
  };

  useEffect(() => {
    if (purchaseOrderId) getPurchaseOrderDetails();
    else resetPurchaseOrderForms();
  }, [purchaseOrderId]);

  useEffect(() => {
    const validateForms = async () => {
      setIsValidDealerDetails(await validateDealerDetails(purchaseOrder));
      setIsValidItemDetails(await validateItemDetails(purchaseOrder));
      setIsValidPaymentDetails(await validatePaymentDetails(purchaseOrder));
    };
  
    validateForms();
  }, [purchaseOrder]);
  

  useEffect(() => {
    setActiveTab(activeTabInitial);
  }, [currentTab]);

  return (
    <div style={{ marginTop: '16px', marginBottom: '16px' }}>
        <Title order={2}>Purchase Order</Title>
        <Group spacing="lg" position='center' style={{ marginTop: '16px', marginBottom: '16px' , }}>
        <TabChip
          label="Dealer Details"
          isValid={isValidDealerDetails}
          tabKey="dealerDetails"
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
        <TabChip
          label="Item Details"
          isValid={isValidItemDetails}
          tabKey="itemDetails"
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
        <TabChip
          label="Payment Details"
          isValid={isValidPaymentDetails}
          tabKey="paymentDetails"
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
        <TabChip
          label="Bill Images"
          isValid={isBillImagesUploaded}
          tabKey="billUpload"
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
         <TabChip
          label="Summary & Action"
          isValid={isValidDealerDetails && isValidItemDetails && isValidPaymentDetails && isBillImagesUploaded}
          tabKey="summary"
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
       
        
      </Group>

      <Tabs value={activeTab}>
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
      <LoadingOverlay visible={loading} />
    </div>
  );
};

export default NewPurchaseOrder;
