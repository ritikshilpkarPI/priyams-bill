import React from 'react';
import { Box, Flex } from '@mantine/core';
import { useSelector } from 'react-redux';
import { selectPurchaseOrder } from '../../redux/purchaseOrder/purchaseOrderSelectors';
import { PaymentDetailsForm } from '../paymentDetailsForm/PaymentDetailsForm';
import { PaymentDetailTable } from '../paymentDetailTable/PaymentDetailTable';
import ShareOnWhatsApp from '../shareOnWhatsApp';

export const PaymentDetailAndBillPanel = () => {
  const purchaseOrder = useSelector(selectPurchaseOrder);
  const currentUrl = window.location.href;
  const match = currentUrl.match(/\/new-purchase-order\/([a-f0-9]{24})/);
  return (
    <>
     <Flex direction="column">
      <PaymentDetailsForm
        purchaseOrderId={purchaseOrder?._id}
        paymentDetailIdx={(purchaseOrder?.purchaseDetails?.length || 0) + 2}
      />
      <PaymentDetailTable
        purchaseOrderId={purchaseOrder?._id}
        totalPaidAmount={purchaseOrder?.totalPaidAmount || 0}
      />
    </Flex>
    <Box mt="16px">
    {
        match && <ShareOnWhatsApp message={currentUrl}/>
      }
    </Box>
     </>
   
  );
};
