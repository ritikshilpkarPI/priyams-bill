import userSlice from './user/userSlice';
import { configureStore } from '@reduxjs/toolkit';
import billReducer from './bill/billSlice';
import billingReducer from './billing/billingSlice';
export const store = configureStore({
  reducer: {
    user: userSlice,
    bill: billReducer,
    billing: billingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
