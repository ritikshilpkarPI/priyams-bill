export const PAGES = {
    Home: "Home",
    billing: "Billing",
    inventory: "Inventory",
    allBill: "All Bills",
    dayBill: "Day Bills",
    openClose: "Open Close",
    stockquantity: "Shortage Items",
    report: "Report",
    purchase: "Purchase",
    attendance: "Attendance",
    approval:"Approval",
    expiredItems: "Expired Items",
    label:"Label"
};

export const sidebarListData = [
    {
       ITEM: [{ name: 'Inventory', url: '/label', icon: 'images/inventory.svg' }, { name: 'Shortage Items', url: '/label', icon: 'images/shortage.svg' },
       { name: 'Expired Items', url: '/label', icon: 'images/expired.svg' }, { name: 'Item Labels', url: '/label', icon: 'images/label.svg' }
       ]
    },
    {
       BILL: [{ name: 'All Bills', url: '/label', icon: 'images/bill.svg' }, { name: 'Day Bills', url: '/label', icon: 'images/dailybills.svg' },
       { name: 'Reports', url: '/label', icon: 'images/report.svg' }
       ]
    },
    {
       STAFF: [{ name: 'Open Close', url: '/label', icon: 'images/openclose.svg' },
       { name: 'Attendance', url: '/label', icon: 'images/attendance.svg' }, { name: 'Profile (New)', url: '/label', icon: 'images/profile.svg' }
       ]
    },
    {
       PURCHASE: [
          { name: 'Purchase Order', url: '/label', icon: 'images/purchaseorder.svg' },
          { name: 'Saved POs', url: '/label', icon: 'images/savedpurchaseorder.svg' },
          { name: 'Drafted POs', url: '/label', icon: 'images/draftpurchaseorder.svg' },
          { name: 'Approved POs', url: '/label', icon: 'images/approvedpurchaseorder.svg' },
          { name: 'Rejected POs', url: '/label', icon: 'images/rejectpurchaseorder.svg' }
       ]
    }
 ];