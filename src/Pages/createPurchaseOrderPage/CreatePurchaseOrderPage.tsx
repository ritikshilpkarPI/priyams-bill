import { DealerDetailsForm } from 'components/dealerDetailsForm/DealerDetailsForm';
import { FormStepper } from 'components/formStepper/FormStepper';
import { ItemDetailsForm } from 'components/itemDetailsForm/ItemDetailsForm';
import { PaymentDetailsForm } from 'components/paymentDetailsForm/PaymentDetailsForm';
import React from 'react';

const CreatePurchaseOrderPage = () => {
  const stepsData: StepperData[] = [
    {
      label: 'Dealer Details',
      component: <DealerDetailsForm />,
    },
    {
      label: 'Payment Details',
      component: <PaymentDetailsForm />,
    },
    {
      label: 'Items Details',
      component: <ItemDetailsForm />,
    },
  ];
  return (
    <div>ss
      CreatePurchaseOrderPage
      <FormStepper steps={stepsData} />
    </div>
  );
};

export default CreatePurchaseOrderPage;
