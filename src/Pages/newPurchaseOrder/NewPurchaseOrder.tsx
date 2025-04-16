import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { DealerDetailForm } from '../../components/dealerDetailForm/DealerDetailForm';
import {  Flex, Chip, Group, LoadingOverlay, Tabs, Title, Badge } from '@mantine/core';
import './NewPurchaseOrder.css';
import { useDispatch } from 'react-redux';
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
import { selectPurchaseOrderStatusInfo } from '../../redux/purchaseOrder/purchaseOrderSelectors';
import { purchaseOrderStatus as purchaseOrderStatusConst } from '../../utils/constants/purchaseOrderStatus';
import { selectPurchaseOrder } from 'src/redux/purchaseOrder/purchaseOrderSelectors';
import {
  validateDealerDetails,
  validateItemDetails,
  validatePaymentDetails,
} from 'src/utils/purchaseOrderValidations';
import { TAB, TabChip, TabKey } from 'src/components/TabChip';
import { useSelector } from 'react-redux';

import { selectPurchasedItems } from '../../redux/purchaseOrder/purchaseOrderSelectors';

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
  const purchaseOrder = useSelector(selectPurchaseOrder);
  const { isApproved = false} = purchaseOrder;
  const [isApprovedPO, setIsApprovedPO] = useState(isApproved);

  const purchaseOrderStatusInfo = useSelector(selectPurchaseOrderStatusInfo);
  const purchaseOrderStatus = (() => {
    const { isApproved, isRejected, isDraft } = purchaseOrderStatusInfo || {};
    const { approved, drafted, rejected, saved } = purchaseOrderStatusConst;
    let label, color;
    if (isDraft && isApproved && !isRejected) {
      label = approved;
      color = 'teal';
    } else if (isDraft && !isApproved && isRejected) {
      label = rejected;
      color = 'red';
    } else if (isDraft && !isApproved && !isRejected) {
      label = drafted;
      color = 'yellow';
    } else if (isDraft === false && isApproved === false) {
      label = saved;
      color = 'orange';
    }
    return { label, color };
  })();

  const [isValidDealerDetails, setIsValidDealerDetails] = useState(false);
  const [isValidItemDetails, setIsValidItemDetails] = useState(false);
  const [isValidPaymentDetails, setIsValidPaymentDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(activeTabInitial);

  const isBillImagesUploaded = Boolean(purchaseOrder?.billPhotos?.length && purchaseOrder.dateOnBill);
  const onTabChange = (newTab: TabKey) => {
    setActiveTab(TAB[newTab]);
    navigate(`${location.pathname}?tab=${newTab}`);
  };

  const purchasedItems = useSelector(selectPurchasedItems);

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
        dealerId: data.dealerId,
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
    else {
      resetPurchaseOrderForms();
      setIsApprovedPO(false);
    }
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

  useEffect(() => {
    setIsApprovedPO(isApproved);
  },[isApproved])

  return (
    <div style={{ marginTop: '16px', marginBottom: '16px' }}>
       <Flex className='purchase-order-title-wrapper' columnGap={30} wrap={'wrap'} align={'center'} justify={'center'}>
        <Title order={2}>Purchase Order</Title>
        {purchaseOrderStatus.label && (
          <Chip defaultChecked color={purchaseOrderStatus.color}>
            {purchaseOrderStatus.label}
          </Chip>
        )}
      </Flex>
      <Tabs
        variant="default"
        color="black"
        value={activeTab}
        onTabChange={onTabChange}
      >
        <Tabs.List grow>
          <Tabs.Tab color="blue" value={TAB.dealerDetails}>
            <TabChip
              label="Dealer Details"
              isValid={isValidDealerDetails}
              tabKey={TAB.dealerDetails}
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
          </Tabs.Tab>
          <Tabs.Tab value={TAB.itemDetails}>
            <Flex align="center" gap="xs">
              <TabChip
                label="Item Details"
                isValid={isValidItemDetails}
                tabKey={TAB.itemDetails}
                activeTab={activeTab}
                onTabChange={onTabChange}
              />
              <Badge
                variant="outline"
                color={purchasedItems?.length ? 'green' : 'red'}
                size="xl"
              >
                {purchasedItems?.length ? purchasedItems?.length : '0'}
              </Badge>
            </Flex>
          </Tabs.Tab>
          <Tabs.Tab value={TAB.paymentDetails}>
           
            <TabChip
              label="Payment Details"
              isValid={isValidPaymentDetails}
              tabKey={TAB.paymentDetails}
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
          </Tabs.Tab>
          <Tabs.Tab value={TAB.billUpload}>
           
            <TabChip
              label="Bill Images"
              isValid={isBillImagesUploaded}
              tabKey={TAB.billUpload}
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
          </Tabs.Tab>
          <Tabs.Tab value={TAB.summary}>
           
            <TabChip
              label="Summary & Action"
              isValid={
                isValidDealerDetails &&
                isValidItemDetails &&
                isValidPaymentDetails &&
                isBillImagesUploaded
              }
              tabKey={TAB.summary}
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>



      <Tabs value={activeTab}>
        <Tabs.Panel value={TAB.dealerDetails}>
          <DealerDetailForm isApprovedPO={isApprovedPO}/>
        </Tabs.Panel>
        <Tabs.Panel value={TAB.itemDetails}>
          <PurchasedItemPanel  isApprovedPO={isApprovedPO}/>
        </Tabs.Panel>
        <Tabs.Panel value={TAB.paymentDetails}>
          <PaymentDetailAndBillPanel />
        </Tabs.Panel>
        <Tabs.Panel value={TAB.billUpload}>
          <BillUploadPanel  isApprovedPO={isApprovedPO}/>
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