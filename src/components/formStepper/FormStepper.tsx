import React, { useState } from 'react';
import { Stepper, Button, Group } from '@mantine/core';
import './FormStepper.css'
export const FormStepper: React.FC<FormStepperProps> = ({ steps }) => {
  const [active, setActive] = useState(0);

  const submitHandler = () => {
    if (active === steps.length) {
    } else {
      setActive((current) => (current < steps.length ? current + 1 : current));
    }
  };

  const nextStep = () =>
    setActive((current) => (current < steps.length ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <div className='form-stepper-container'>
      <Stepper  size="xs"  active={active} onStepClick={setActive}>
        {steps.map((step, index) => (
          <Stepper.Step
            key={index}
            label={step.label}
          >
            {step.component}
          </Stepper.Step>
        ))}
        <Stepper.Completed>
          Completed, click back button to return to the previous step.
        </Stepper.Completed>
      </Stepper>

      <Group position="right" mt="xl">
        <Button variant="default" onClick={prevStep} disabled={active === 0}>
          Back
        </Button>
        <Button onClick={submitHandler}>
          {active === steps.length ? 'Submit' : 'Save And Next'}
        </Button>
      </Group>
    </div>
  );
};
