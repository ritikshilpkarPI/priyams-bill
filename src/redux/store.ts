import { configureStore } from '@reduxjs/toolkit';
import billReducer from './bill/billSlice';
import allItemsFeedDataSlice from './allItemsFeedData/allItemsFeedDataSlice';
import itemsSlice from './items/itemsSlice';
import dealerDetailFormSlice from './dealerDetailForm/dealerDetailFormSlice';
import purchasedItemDetailFormSlice from './purchasedItemDetailForm/purchasedItemDetailFormSlice';
import purchaseOrderSlice from './purchaseOrder/purchaseOrderSlice';
import paymentDetailFormSlice from './paymentDetailForm/paymentDetailFormSlice';
import storeInventoryManagement from  "./storeInventoryManagement/storeInventoryManagementSlice";
import brandSlice from "./brands/brandSlice"
import companySlice from "./companys/companySlice"
import staffSlice from "./staffList/StaffSlice";
import expiredItemsSlice from './expiredItems/expiredItemsSlice'
import purchaseListApprovalSlice from './purchaseListApproval/purchaseListApprovalSlice'
import dealerSlice from './dealerlist/dealerSlice';
import expiredItemsBatchSlice from './expiredItemsBatch/ExpiredItemsBatchSlice'

export const store = configureStore({
  reducer: {
    bill: billReducer,
    allItemsFeedData: allItemsFeedDataSlice,
    items: itemsSlice,
    dealerDetailForm: dealerDetailFormSlice,
    purchasedItemDetailForm: purchasedItemDetailFormSlice,
    purchaseOrder: purchaseOrderSlice,
    paymentDetailForm: paymentDetailFormSlice,
    storeInventoryManagement: storeInventoryManagement,
    dealer: dealerSlice,
    brands: brandSlice,
    company: companySlice,
    staffs: staffSlice,
    expiredItems: expiredItemsSlice,
    purchaseListApproval:purchaseListApprovalSlice,
    expiredItemsBatch: expiredItemsBatchSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
