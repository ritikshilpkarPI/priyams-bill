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
  attendance: 'Attendance',
  approval: 'Approval',
  expiredItems: 'Expired Items',
  label: 'Label',
  orders: 'User Orders'
};

export const sidebarListData = [
  {
    ITEM: [
      { name: 'Inventory', url: '/inventory', icon: 'images/inventory.svg' },
      {
        name: 'Shortage Items',
        url: '/stockquantity',
        icon: 'images/shortage.svg',
      },
      {
        name: 'Expired Items',
        url: '/expiredItems',
        icon: 'images/expired.svg',
      },
      { name: 'Item Labels', url: '/label', icon: 'images/label.svg' },
      { name: 'Item Barcode ', url: '/itemsBarcode', icon: 'images/barcode.svg' },
      {name: 'Move Item To Cart', url: '/moveToCart', icon: 'images/purchaseorder.svg'},
      {name: 'Add Expired Item', url:'/addExpiredItem', icon: 'images/addExpiredIcon.svg'},
      {name: 'Expired Items', url:'/expiredItemList', icon: 'images/expireIcon.svg'},


    ],
  },
  {
    BILL: [
      { name: 'All Bills', url: '/allBill', icon: 'images/bill.svg' },
      { name: 'Return & Exchange', url: '/returnAndExchange', icon: 'images/returnBill.svg' },
      { name: 'Day Bills', url: '/dayBill', icon: 'images/dailybills.svg' },
      { name: 'Reports', url: '/report', icon: 'images/report.svg' },
      { name: 'New Billing Page', url: '/newBilling', icon: 'images/report.svg' },
    ],
  },
  {
    STAFF: [
      { name: 'Open Close', url: '/openClose', icon: 'images/openclose.svg' },
      { name: 'Attendance', url: '/attendance', icon: 'images/attendance.svg' },
      { name: 'Profile (New)', url: '/', icon: 'images/profile.svg' },
    ],
  },
  {
    PURCHASE: [
      {
        name: 'Purchase Order',
        url: '/purchase',
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
      {
        name: 'Paid POs',
        url: '/paidPOs',
        icon: 'images/billPaid.svg',
      },
      {
        name: 'Unpaid POs',
        url: '/unpaidPOs',
        icon: 'images/billUnpaid.svg',
      },
    ],
  },
  {
    ORDERS: [
      {name: 'User Orders', url: '/orders', icon: 'images/purchaseorder.svg'}
    ]
  }
];
