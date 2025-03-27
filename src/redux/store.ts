import userSlice from './user/userSlice';
import { configureStore } from '@reduxjs/toolkit';
import billReducer from './bill/billSlice';
import allItemsFeedDataSlice from './allItemsFeedData/allItemsFeedDataSlice';
import itemsSlice from './items/itemsSlice';
import dealerDetailFormSlice from './dealerDetailForm/dealerDetailFormSlice';
import purchasedItemDetailFormSlice from './purchasedItemDetailForm/purchasedItemDetailFormSlice';
import purchaseOrderSlice from './purchaseOrder/purchaseOrderSlice';
import paymentDetailFormSlice from './paymentDetailForm/paymentDetailFormSlice';
import stepperReducer from "./stepper/stepperSlice";
import storeInventoryManagement from  "./storeInventoryManagement/storeInventoryManagementSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    stepper: stepperReducer,
    bill: billReducer,
    allItemsFeedData: allItemsFeedDataSlice,
    items: itemsSlice,
    dealerDetailForm: dealerDetailFormSlice,
    purchasedItemDetailForm: purchasedItemDetailFormSlice,
    purchaseOrder: purchaseOrderSlice,
    paymentDetailForm: paymentDetailFormSlice,
    storeInventoryManagement: storeInventoryManagement,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
