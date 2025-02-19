import userSlice from './user/userSlice';
import { configureStore } from '@reduxjs/toolkit';
import billReducer from './bill/billSlice';
import allItemsFeedDataSlice from './allItemsFeedData/allItemsFeedDataSlice';
import itemsSlice from './items/itemsSlice';
import dealerDetailFormSlice from './dealerDetailForm/dealerDetailFormSlice';
import purchasedItemDetailFormSlice from './purchasedItemDetailForm/purchasedItemDetailFormSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    bill: billReducer,
    allItemsFeedData: allItemsFeedDataSlice,
    items: itemsSlice,
    dealerDetailForm: dealerDetailFormSlice,
    purchasedItemDetailForm: purchasedItemDetailFormSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
