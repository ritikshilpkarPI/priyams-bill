import React, { useEffect, useState } from 'react';
import { Stepper, Button, Group, Alert, Popover, Text } from '@mantine/core';
import './FormStepper.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  initializeSteps,
  setCurrentStep,
} from '../../redux/stepper/stepperSlice';
import { useMediaQuery } from '@mantine/hooks';

export const FormStepper: React.FC = () => {
  const dispatch = useDispatch();
  const { currentStep, stepCompletion, steps, isStepperVisible } = useSelector(
    (state: RootState) => state?.stepper
  );

  const isMobile = useMediaQuery('(max-width: 767px)');

  const [showPopover, setShowPopover] = useState(false);

  const isStepClickable = (index: number) => stepCompletion[index];

  const nextStep = () => {
    if (stepCompletion[currentStep]) {
      dispatch(setCurrentStep(currentStep + 1));
      setShowPopover(false);
    } else {
      setShowPopover(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      dispatch(setCurrentStep(currentStep - 1));
    }
  };

  useEffect(() => {
    if (steps?.length) {
      dispatch(initializeSteps(steps));
    }
  }, [dispatch, steps]);

  if (!isStepperVisible || !steps?.length) return null;

  return (
    <div className="form-stepper-component">
      <div className="form-stepper-container">
        <Stepper
          size="xs"
          iconSize={isMobile ? 22 : 32}
          active={currentStep}
          onStepClick={(index) =>
            isStepClickable(index) && dispatch(setCurrentStep(index))
          }
        >
          {steps?.map((step, index) => (
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
          <Popover
            width={200}
            position="bottom"
            withArrow
            shadow="md"
            opened={showPopover} 
            onChange={setShowPopover}
          >
            <Popover.Target>
              <Button onClick={nextStep}>
                {currentStep === steps.length - 1 ? 'Submit' : 'Save and Next'}
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Text size="xs">
                Please complete this step before proceeding.
              </Text>
            </Popover.Dropdown>
          </Popover>
        </Group>
      </div>
    </div>
  );
};
