import React from 'react';
import { Flex } from '@mantine/core';
import { useSelector } from 'react-redux';
import { selectPurchaseOrder } from '../../redux/purchaseOrder/purchaseOrderSelectors';
import { PaymentDetailsForm } from '../paymentDetailsForm/PaymentDetailsForm';
import { PaymentDetailTable } from '../paymentDetailTable/PaymentDetailTable';

export const PaymentDetailAndBillPanel = () => {
  const purchaseOrder = useSelector(selectPurchaseOrder);
  return (
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
  );
};
