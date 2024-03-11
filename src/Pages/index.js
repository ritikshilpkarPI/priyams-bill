import { lazy } from 'react';

export const Home = lazy(() => import('./Home'));
export const BillFeed = lazy(() => import('./BillFeed'));
export const Billing = lazy(() => import('./Billing'));
export const DayWiseBillFeed = lazy(() => import('./DailyBill'));
export const EditBill = lazy(() => import('./EditBill'));
export const ItemsList = lazy(() => import('./ItemsList'));
export const OpenClose = lazy(() => import('./OpenClose'));
export const StockQuantity = lazy(() => import('./StockQuantity'));
export const Report = lazy(() => import('./Report'));
export const Login = lazy(() => import('./Login'));
export const PurchaseOrder = lazy(() => import('./PurchaseOrder'));
export const Attendance = lazy(() => import('./Attendance'));
export const Approval = lazy(() => import('./Approval'));
export const ExpiredItems = lazy(() => import('./ExpiredItems'));
export const Orders = lazy(() => import('./Orders'));
export const OrderStatusDetail = lazy(() => import('./OrderStatusDetail'))
export const NewBillingPage = lazy(()=>  import('./NewBillingPage'))
