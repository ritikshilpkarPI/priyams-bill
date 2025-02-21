import userSlice from './user/userSlice';
import { configureStore } from '@reduxjs/toolkit';
import billReducer from './bill/billSlice';
import allItemsFeedDataSlice from './allItemsFeedData/allItemsFeedDataSlice';
import itemsSlice from './items/itemsSlice';
import stepperReducer from "./stepper/stepperSlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    stepper: stepperReducer,
    bill: billReducer,
    allItemsFeedData: allItemsFeedDataSlice,
    items: itemsSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
