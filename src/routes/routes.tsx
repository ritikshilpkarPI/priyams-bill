import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import UnAuthorizedRoute from '../components/UnAuthorizedRoute';
import AdminRoute from '../components/AdminRoute';
import { ROUTES } from '../utils/constants/routes';
import CustomerBill from '../Pages/CustomerBill';
import PerItemListPurchaseOrder from '../components/IndividualItemListPurchaseOrder';
import ItemListPurchaseOrderHistory from '../components/ListPurchaseOrderHistory';
import { ItemsBarCode } from '../Pages/itemsBarcode';
import { ItemQuantity } from '../Pages/ItemQuantity';

import {
  Home,
  BillFeed,
  DayWiseBillFeed,
  EditBill,
  ItemsList,
  OpenClose,
  StockQuantity,
  Report,
  Login,
  PurchaseOrder,
  Attendance,
  Approval,
  ExpiredItems,
  Orders,
  OrderStatusDetail,
  NewBillingPage,
  PaidPOs,
  UnpaidPOs,
  UnpaidPurchaseOrder,
  PayPurchaseOrderBill,
  AddExpiredItem,
  ExpiredItemList,
  ReturnAndExchange,
  SellDetailsPage,
  BarcodePrint,
  Label,
  NewPurchaseOrder,
  CreatePurchaseOrderPage,
  StoreInventoryManagement,
} from '../Pages';
import App from '../App';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <AdminRoute />,
        children: [
          {
            path: ROUTES.DAY_BILL,
            element: <DayWiseBillFeed />,
            index: true,
          },
          {
            path: ROUTES.REPORT,
            element: <Report />,
            index: true,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: ROUTES.HOME,
            element: <NewBillingPage />,
            index: true,
          },
          {
            path: ROUTES.BILLING,
            element: <NewBillingPage />,
            index: true,
          },
          {
            path: ROUTES.OPEN_CLOSE,
            element: <OpenClose />,
            index: true,
          },
          {
            path: ROUTES.INVENTORY,
            element: <ItemsList />,
            index: true,
          },
          {
            path: ROUTES.INVENTORY_ITEMS_BY_ID,
            element: <PerItemListPurchaseOrder />,
            index: true,
          },
          {
            path: ROUTES.PURCHASE_ORDER_ITEMS_BY_ID,
            element: <ItemListPurchaseOrderHistory />,
            index: true,
          },
          {
            path: ROUTES.ATTENDANCE,
            element: <Attendance />,
            index: true,
          },
          {
            path: ROUTES.STOCK_QUANTITY,
            element: <StockQuantity />,
            index: true,
          },
          {
            path: ROUTES.ALL_BILL,
            element: <BillFeed />,
            index: true,
          },
          {
            path: ROUTES.PURCHASE_ORDER,
            element: <PurchaseOrder />,
            index: true,
          },
          {
            path: ROUTES.PURCHASE_ORDER_BY_ID,
            element: <PurchaseOrder />,
            index: true,
          },
          {
            path: ROUTES.PURCHASE_ORDER_BY_ID,
            element: <PurchaseOrder />,
            index: true,
          },
          {
            path: ROUTES.EDIT_BILL_BY_ID,
            element: <EditBill />,
            index: true,
          },
          {
            path: ROUTES.APPROVAL,
            element: <Approval />,
            index: true,
          },
          {
            path: ROUTES.EXPIRED_ITEMS,
            element: <ExpiredItems />,
            index: true,
          },
          {
            path: ROUTES.LABEL,
            element: <Label />,
            index: true,
          },
          {
            path: ROUTES.ORDERS,
            element: <Orders />,
            index: true,
          },
          {
            path: ROUTES.ORDER_BY_STATUS,
            element: <OrderStatusDetail />,
            index: true,
          },
          {
            path: ROUTES.NEW_BILLING,
            element: <NewBillingPage />,
            index: true,
          },
          {
            path: ROUTES.ITEMS_BARCODE,
            element: <ItemsBarCode />,
            index: true,
          },
          {
            path: ROUTES.MOVE_TO_CART,
            element: <ItemQuantity />,
            index: true,
          },
          {
            path: ROUTES.PAID_PO,
            element: <PaidPOs />,
            index: true,
          },
          {
            path: ROUTES.UNPAID_PO,
            element: <UnpaidPOs />,
            index: true,
          },
          {
            path: ROUTES.PURCHASE_ORDER_BILL_BY_ID,
            element: <UnpaidPurchaseOrder />,
            index: true,
          },
          {
            path: ROUTES.PAY_PURCHASE_ORDER_BILL,
            element: <PayPurchaseOrderBill />,
            index: true,
          },
          {
            path: ROUTES.RETURN_AND_EXCHANGE,
            element: <ReturnAndExchange />,
            index: true,
          },
          {
            path: ROUTES.PO_SELL_DETAILS,
            element: <SellDetailsPage />,
            index: true,
          },
          {
            path: ROUTES.BARCODE_PRINT,
            element: <BarcodePrint />,
            index: true,
          },
          {
            path: ROUTES.NEW_PURCHASE_ORDER,
            element: <NewPurchaseOrder />,
            index: true,
          },
          {
            path: ROUTES.NEW_PURCHASE_ORDER_BY_ID,
            element: <NewPurchaseOrder />,
            index: true,
          },
          {
            path: ROUTES.CREATE_PURCHASE_ORDER,
            element: <CreatePurchaseOrderPage />,
            index: true,
          }
        ]
      },
      {
        element: <UnAuthorizedRoute />,
        children: [
          {
            path: ROUTES.LOGIN,
            element: <Login />,
            index: true,
          },
        ],
      },
      {
        path: ROUTES.CUSTOMER_BILL,
        element: <CustomerBill />,
        index: true,
      },
      {
        path: ROUTES.ADD_EXPIRED_ITEM,
        element: <AddExpiredItem />,
        index: true,
      },
      {
        path: ROUTES.EXPIRED_ITEM_LIST,
        element: <ExpiredItemList />,
        index: true,
      },
      {
        path: ROUTES.STORE_INVENTORY,
        element: <StoreInventoryManagement />,
        index: true,
      }
    ],
  },
  {
    path: '*',
    element: <>Page Not Found - 404</>,
  },
]);
