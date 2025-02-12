import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: StepperStateInterface = {
  currentStep: 0,
  stepCompletion: [],
  steps: [],
};

const stepperSlice = createSlice({
  name: 'stepper',
  initialState,
  reducers: {
    initializeSteps: (state, action: PayloadAction<StepInterface[]>) => {
      state.steps = action.payload;
      state.stepCompletion = Array(action.payload.length).fill(false);
    },

    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },

    completeStep: (state, action: PayloadAction<number>) => {
      state.stepCompletion[action.payload] = true;
    },
  },
});

export const { initializeSteps, setCurrentStep, completeStep } = stepperSlice.actions;
export default stepperSlice.reducer;
