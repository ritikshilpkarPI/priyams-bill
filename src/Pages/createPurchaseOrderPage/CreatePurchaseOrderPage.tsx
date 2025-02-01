import React, { useEffect } from 'react';
import './CreatePurchaseOrderPage.css';
import { Text } from '@mantine/core';
import { useDispatch } from 'react-redux';
import {
  initializeSteps,
  toggleStepperVisibility,
} from '../../redux/stepper/stepperSlice';

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
    dispatch(toggleStepperVisibility(true));
    dispatch(initializeSteps(stepsData));
    return () => {
      dispatch(toggleStepperVisibility(false));
      dispatch(initializeSteps([]));
    };
  }, [dispatch]);

  return (
    <div className="create-purchase-order-page-container">
    </div>
  );
};

export default CreatePurchaseOrderPage;
