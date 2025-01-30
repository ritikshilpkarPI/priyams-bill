import React from 'react';
import { FormStepper } from 'components/formStepper/FormStepper';
import './CreatePurchaseOrderPage.css';
import { Text } from '@mantine/core';

const CreatePurchaseOrderPage = () => {
  const stepsData: StepperData[] = [
    {
      label: 'Dealer Details',
      component: <div>Dealer Details Form</div>,
    },
    {
      label: 'Payment Details',
      component: <div>Payment Details Form</div>,
    },
    {
      label: 'Items Details',
      component: <div>Item Details Form</div>,
    },
  ];
  
  return (
    <div className="create-purchase-order-page-container">
      <Text size="xl">Create Purchase Order</Text>
      <div style={{ maxWidth: 600, margin: 'auto', padding: 10 }}>
         <FormStepper steps={stepsData} />
      </div>
    </div>
  );
};

export default CreatePurchaseOrderPage;
