import userSlice from './user/userSlice';
import { configureStore } from '@reduxjs/toolkit';
import billReducer from './bill/billSlice';
import allItemsFeedDataSlice from './allItemsFeedData/allItemsFeedDataSlice';
import stepperReducer from "./stepper/stepperSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    stepper: stepperReducer,
    bill: billReducer,
    allItemsFeedData: allItemsFeedDataSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
