import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: StepperStateInterface = {
  currentStep: 0,
  stepCompletion: [],
  isStepperVisible: false,
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

    toggleStepperVisibility: (state, action: PayloadAction<boolean>) => {
      state.isStepperVisible = action.payload;
    },
  },
});

export const { initializeSteps, setCurrentStep, completeStep, toggleStepperVisibility } = stepperSlice.actions;
export default stepperSlice.reducer;
