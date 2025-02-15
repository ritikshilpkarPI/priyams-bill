import React, { useEffect } from 'react';
import { Text } from '@mantine/core';
import { useDispatch } from 'react-redux';
import {
  initializeSteps,
} from '../../redux/stepper/stepperSlice';
import { FormStepper } from 'src/components/formStepper/FormStepper';

const CreatePurchaseOrderPage = () => {
  const dispatch = useDispatch();
  const stepsData: StepInterface[] = [
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

  useEffect(() => {
    dispatch(initializeSteps(stepsData));
    return () => {
      dispatch(initializeSteps([]));
    };
  }, [dispatch]);

  return (
    <div className="create-purchase-order-page-container">
      <Text>Create Purchase Order</Text>
      <FormStepper
      steps= {stepsData}
      />
    </div>
  );
};

export default CreatePurchaseOrderPage;
