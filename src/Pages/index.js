import { lazy } from 'react';
export const BillFeed = lazy(() => import('./BillFeed'));
export const AllBills = lazy(() => import('./AllBills'));
export const DayWiseBillFeed = lazy(() => import('./DailyBill'));
export const ItemsList = lazy(() => import('./ItemsList'));
export const OpenClose = lazy(() => import('./OpenClose'));
export const Report = lazy(() => import('./Report'));
export const Login = lazy(() => import('./Login'));
export const ExpiredItems = lazy(() => import('./ExpiredItems'));
export const Approval = lazy(() => import('./Approval'));
export const Orders = lazy(() => import('./Orders'));
export const OrderStatusDetail = lazy(() => import('./OrderStatusDetail'));
export const NewBillingPage = lazy(()=>  import('./newBillPage/NewBillPage'));
export const AddExpiredItem = lazy(()=> import('./AddExpiredItem'))
export const ExpiredItemList = lazy(()=> import('./ExpiredItemList'))
export const ReturnAndExchange = lazy(()=> import('./ReturnBill'));
export const SellDetailsPage = lazy(()=> import('./sellDetailsPage/SellDetailsPage'));
export const BarcodePrint = lazy(()=> import('./barcodePrint/BarcodePrint'));
export const Label = lazy(() => import('./Label'));
export const NewPurchaseOrder = lazy(() => import('./newPurchaseOrder/NewPurchaseOrder'));
export const StoreInventoryManagement = lazy(() => import('./storeInventoryManagement/StoreInventoryManagement'));
export const StoreInventory = lazy(() => import('./storeInventory/StoreInventory'));
export const NewInventoryPage = lazy(()=> import("./NewInventoryPage"));
export const ItemPurchaseOrdersPage = lazy (()=> import("./ItemPurchaseOrdersPage"));