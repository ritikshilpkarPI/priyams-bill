import userSlice from './user/userSlice';
import { configureStore } from '@reduxjs/toolkit';
import billReducer from './bill/billSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    bill: billReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
