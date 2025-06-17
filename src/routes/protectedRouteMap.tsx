import { ReactNode } from 'react';
import { ROUTES } from '../utils/constants/routes';
import PerItemListPurchaseOrder from '../components/IndividualItemListPurchaseOrder';
import { ItemsBarCode } from '../Pages/itemsBarcode';
import Dashboard from '../Pages/DashboardV2';

import {
  ItemsList,
  OpenClose,
  Approval,
  ExpiredItems,
  Orders,
  OrderStatusDetail,
  NewBillingPage,
  AddExpiredItem,
  ExpiredItemList,
  ReturnAndExchange,
  SellDetailsPage,
  BarcodePrint,
  Label,
  NewPurchaseOrder,
  StoreInventoryManagement,
  AllBills,
  NewInventoryPage,
  ItemPurchaseOrdersPage,
  StoreInventory,
  StockTransactions,
  ExpiryItemsBatch,
  DealerCatalog,
  StockTransactionsPage
} from '../Pages';
import AddClearancePage from 'src/Pages/AddClearancePage';

interface RouteConfig {
    path: string;
    element: ReactNode;
    index?: boolean;
  }

export const protectedRouteMap: Record<string, RouteConfig> = {
    DASHBOARD: {
      path: ROUTES.DASHBOARD,
      element: <Dashboard />,
      index: true,
    },
    BILLING: {
      path: ROUTES.BILLING,
      element: <NewBillingPage/>,
    },
    NEW_BILLING: {
      path: ROUTES.NEW_BILLING,
      element: <NewBillingPage />,
    },
    OPEN_CLOSE: {
      path: ROUTES.OPEN_CLOSE,
      element: <OpenClose />,
      index: true,
    },
    INVENTORY: {
      path: ROUTES.INVENTORY,
      element: <ItemsList />,
      index: true,
    },
    INVENTORY_ITEMS_BY_ID: {
      path: ROUTES.INVENTORY_ITEMS_BY_ID,
      element: <PerItemListPurchaseOrder />,
      index: true,
    },
    ALL_BILL: {
      path: ROUTES.ALL_BILL,
      element: <AllBills />,
      index: true,
    },
    APPROVAL: {
      path: ROUTES.APPROVAL,
      element: <Approval />,
      index: true,
    },
    EXPIRED_ITEMS: {
      path: ROUTES.EXPIRED_ITEMS,
      element: <ExpiredItems />,
      index: true,
    },
    LABEL: {
      path: ROUTES.LABEL,
      element: <Label />,
      index: true,
    },
    ORDERS: {
      path: ROUTES.ORDERS,
      element: <Orders />,
      index: true,
    },
    ORDER_BY_STATUS: {
      path: ROUTES.ORDER_BY_STATUS,
      element: <OrderStatusDetail />,
      index: true,
    },
    ITEMS_BARCODE: {
      path: ROUTES.ITEMS_BARCODE,
      element: <ItemsBarCode />,
      index: true,
    },
    RETURN_AND_EXCHANGE: {
      path: ROUTES.RETURN_AND_EXCHANGE,
      element: <ReturnAndExchange />,
      index: true,
    },
    PO_SELL_DETAILS: {
      path: ROUTES.PO_SELL_DETAILS,
      element: <SellDetailsPage />,
      index: true,
    },
    BARCODE_PRINT: {
      path: ROUTES.BARCODE_PRINT,
      element: <BarcodePrint />,
      index: true,
    },
    NEW_PURCHASE_ORDER: {
      path: ROUTES.NEW_PURCHASE_ORDER,
      element: <NewPurchaseOrder />,
      index: true,
    },
    NEW_PURCHASE_ORDER_BY_ID: {
      path: ROUTES.NEW_PURCHASE_ORDER_BY_ID,
      element: <NewPurchaseOrder />,
      index: true,
    },
    PURCHASE_ORDER_BY_ID: {
      path: ROUTES.PURCHASE_ORDER_BY_ID,
      element: <NewPurchaseOrder />,
      index: true,
    },
    ADD_EXPIRED_ITEM: {
      path: ROUTES.ADD_EXPIRED_ITEM,
      element: <AddExpiredItem />,
      index: true,
    },
    UPDATE_EXPIRED_ITEM: {
      path: ROUTES.UPDATE_EXPIRY_ITEMS_BATCH,
      element: <AddExpiredItem />,
      index: true,
    },
    EXPIRED_ITEM_LIST: {
      path: ROUTES.EXPIRED_ITEM_LIST,
      element: <ExpiredItemList />,
      index: true,
    },
    STORE_INVENTORY: {
      path: ROUTES.STORE_INVENTORY,
      element: <StoreInventory />,
      index: true,
    },
    STORE_INVENTORY_MANAGEMENT: {
      path: ROUTES.STORE_INVENTORY_MANAGEMENT,
      element: <StoreInventoryManagement />,
      index: true,
    },
    STORE_INVENTORY_MANAGEMENT_BY_ID: {
      path: ROUTES.STORE_INVENTORY_MANAGEMENT_BY_ID,
      element: <StoreInventoryManagement />,
      index: true,
    },
    EXPIRY_ITEMS_BATCH: {
      path: ROUTES.EXPIRY_ITEMS_BATCH,
      element: <ExpiryItemsBatch />,
      index: true,
    },
    EXPIRY_ITEMS_BATCH_BY_ID: {
      path: ROUTES.EXPIRY_ITEMS_BATCH_BY_ID,
      element: <ExpiryItemsBatch />,
      index: true,
    },
    NEW_INVENTORY_PAGE: {
      path: ROUTES.WAREHOUSE_INVENTORY_PAGE,
      element: <NewInventoryPage />,
      index: true,
    },
    ITEM_PURCHASE_ORDERS: {
      path: ROUTES.ITEM_PURCHASE_ORDERS,
      element: <ItemPurchaseOrdersPage />,
      index: true,
    },
    STORE_TRANSACTIONS: {
      path: ROUTES.STORE_TRANSACTIONS,
      element: <StockTransactions />,
      index: true,
    },
    ADD_EXPIRY_ITEMS_BATCH_CLEARANCE: {
      path: ROUTES.ADD_EXPIRY_ITEMS_BATCH_CLEARANCE,
      element: <AddClearancePage />,
      index: true,
    },
    DEALER_CATALOG: {
      path: ROUTES.DEALER_CATALOG,
      element: <DealerCatalog />,
      index: true,
    },
    STOCK_TRANSACTIONS: {
      path: ROUTES.STOCK_TRANSACTIONS,
      element: <StockTransactionsPage />,
      index: true,
    },

  };