import { ROUTES } from 'src/utils/constants/routes';

export const PAGES = {
  Home: 'Home',
  billing: 'Billing',
  newBilling: 'New Billing',
  inventory: 'Inventory',
  allBill: 'All Bills',
  dayBill: 'Day Bills',
  openClose: 'Open Close',
  stockquantity: 'Shortage Items',
  report: 'Report',
  purchase: 'Purchase',
  approval: 'Approval',
  expiredItems: 'Expired Items',
  label: 'Label',
  orders: 'User Orders',
};

export const sidebarListData = [
  {
    ITEM: [
      { name: 'Inventory', url: '/newInventoryPage', icon: 'images/inventory.svg' },
      { name: 'Store Inventory', url: '/storeInventory', icon: 'images/inventory.svg' },
      
      { name: 'Item Labels', url: '/label', icon: 'images/label.svg' },
      { name: 'Item Barcode ', url: '/itemsBarcode', icon: 'images/barcode.svg' },
      {
        name: 'Expiry Alert',
        url: '/expiredItems',
        icon: 'images/expired.svg',
      },
      {
        name: 'Add Expired Item',
        url: '/addExpiredItem',
        icon: 'images/addExpiredIcon.svg',
      },
      {
        name: 'Expired Items',
        url: '/expiry-items-batch',
        icon: 'images/expireIcon.svg',
      },
      {
        name: 'Barcode Prints',
        url: '/barcodePrint',
        icon: 'images/barcode.svg',
      },
      { name: 'New Transaction', url: '/storeInventoryManagement', icon: 'images/inventory.png' },
      {
        name: 'Stock Transaction',
        url: '/stockTransactions',
        icon: 'images/inventory-management.svg'
      }
    ],
  },
  {
    BILL: [
      { name: 'All Bills', url: '/allBill', icon: 'images/bill.svg' },
      {
        name: 'Return & Exchange',
        url: '/returnAndExchange',
        icon: 'images/returnBill.svg',
      },
      { name: 'Day Bills', url: '/dayBill', icon: 'images/dailybills.svg' },
      { name: 'Reports', url: '/report', icon: 'images/report.svg' },
    ],
  },
  {
    STAFF: [
      { name: 'Open Close', url: '/openClose', icon: 'images/openclose.svg' },
    ],
  },
  {
    PURCHASE: [
      {
        name: 'Purchase Order',
        url: ROUTES.NEW_PURCHASE_ORDER,
        icon: 'images/purchaseorder.svg',
      },
      {
        name: 'Saved POs',
        url: '/approval',
        icon: 'images/savedpurchaseorder.svg',
      },
      {
        name: 'Drafted POs',
        url: '/approval',
        icon: 'images/draftpurchaseorder.svg',
      },
      {
        name: 'Approved POs',
        url: '/approval',
        icon: 'images/approvedpurchaseorder.svg',
      },
      {
        name: 'Rejected POs',
        url: '/approval',
        icon: 'images/rejectpurchaseorder.svg',
      },
      
    ],
  },
  {
    ORDERS: [
      { name: 'User Orders', url: '/orders', icon: 'images/purchaseorder.svg' },
    ],
  }
];
