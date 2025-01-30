import React, { useEffect } from 'react';
import { Stepper, Button, Group } from '@mantine/core';
import './FormStepper.css';
import { useDispatch, useSelector } from 'react-redux';
import { initializeSteps, setCurrentStep } from '../../redux/stepper/stepperSlice';
import { useMediaQuery } from '@mantine/hooks';


export const FormStepper: React.FC<FormStepperProps> = ({ steps }) => {
  const dispatch = useDispatch();
  const { currentStep, stepCompletion } = useSelector(
    (state: RootState) => state.stepper
  );

  const isMobile = useMediaQuery('(max-width: 767px)');

  const isStepClickable = (index: number) => stepCompletion[index];

  const nextStep = () => {
    if (stepCompletion[currentStep]) {
      dispatch(setCurrentStep(currentStep + 1));
    } else {
      alert('Please complete the current step before moving to the next one!');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  };

  useEffect(() => {
    dispatch(initializeSteps(steps.length));
  }, [dispatch, steps.length]);

  return (
    <div className="form-stepper-container">
      <Stepper
        size="xs"
        iconSize={isMobile ? 22 : 32}
        active={currentStep}
        onStepClick={(index) =>
          isStepClickable(index) && dispatch(setCurrentStep(index))
        }
      >
        {steps.map((step, index) => (
          <Stepper.Step key={index} label={step.label}>
            {step.component}
          </Stepper.Step>
        ))}
        <Stepper.Completed>
          All steps completed! Click back to review.
        </Stepper.Completed>
      </Stepper>

      <Group position="right" mt="xl">
        <Button
          variant="default"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button onClick={nextStep}>
          {currentStep === steps.length - 1 ? 'Submit' : 'Save and Next'}
        </Button>
      </Group>
    </div>
  );
};
