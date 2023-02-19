import { include } from 'named-urls';

export const routes = {
  home: '/',
  login: '/login',
  showBill: '/showBill/:customerBillId',
  billing: '/billing',
  openClose: '/openClose',
  inventory: '/inventory',
  dayBill: '/dayBill',
  stockQuantity: '/stockquantity',
  allBills: '/allBill',
  billReport: '/report',
  editBill: '/edit/:billingID',
  approval: '/approval',
  editPurchaseOrder: '/',
};
