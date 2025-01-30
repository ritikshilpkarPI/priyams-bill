import { configureStore } from '@reduxjs/toolkit';
import userSlice from './user/userSlice';
import stepperReducer from "./stepper/stepperSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    stepper: stepperReducer,
  },
});