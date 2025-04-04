import { configureStore } from '@reduxjs/toolkit';
import billReducer from './bill/billSlice';
import allItemsFeedDataSlice from './allItemsFeedData/allItemsFeedDataSlice';
import itemsSlice from './items/itemsSlice';
import dealerDetailFormSlice from './dealerDetailForm/dealerDetailFormSlice';
import purchasedItemDetailFormSlice from './purchasedItemDetailForm/purchasedItemDetailFormSlice';
import purchaseOrderSlice from './purchaseOrder/purchaseOrderSlice';
import paymentDetailFormSlice from './paymentDetailForm/paymentDetailFormSlice';
import storeInventoryManagement from  "./storeInventoryManagement/storeInventoryManagementSlice";
import userSlice from './user/userSlice';
import dealerSlice from './dealerlist/dealerSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    bill: billReducer,
    allItemsFeedData: allItemsFeedDataSlice,
    items: itemsSlice,
    dealerDetailForm: dealerDetailFormSlice,
    purchasedItemDetailForm: purchasedItemDetailFormSlice,
    purchaseOrder: purchaseOrderSlice,
    paymentDetailForm: paymentDetailFormSlice,
    storeInventoryManagement: storeInventoryManagement,
    dealer: dealerSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
