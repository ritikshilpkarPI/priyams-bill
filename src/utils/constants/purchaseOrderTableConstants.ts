export const purchaseOrderTableConstants = Object.freeze({
    IS_PAID: 'isPaid',
    SHARE: 'share',
    ACTIONS: 'actions',
  
    COLUMNS: [
      { key: 'serial', label: 'S.No.', sortable: true },
      {
        key: 'isPaid',
        label: 'Paid',
        sortable: true,
      },
      { key: 'dealerName', label: 'Dealer Name' },
      { key: 'BrandName', label: 'Brand Name' },
      { key: 'CompanyName', label: 'Company Name' },
      { key: 'phoneNumber', label: 'Phone Number' },
      { key: 'payment', label: 'Payment' },
      { key: 'totalBillAmount', label: 'Total Bill' },
      { key: 'totalPaidAmount', label: 'Paid Amount' },
      { key: 'procurementSource', label: 'Procurement Source' },
      { key: 'createdAt', label: 'Created At' },
      { key: 'remark', label: 'Remark' },
      { key: 'averageProfitMargin', label: 'Profit Margin (%)' },
      { key: 'uniqueItemsCount', label: 'Unique Items' },
      { key: 'existingItemsCount', label: 'Existing Items' },
      { key: 'newItemsCount', label: 'New Items' },
      { key: 'itemsWithManuAndExpiry', label: 'Manu & Expiry' },
      { key: 'itemsWithShortExpiry', label: 'Short Expiry' },
      { key: 'share', label: 'Share' },
      { key: 'actions', label: 'Actions' },
    ],
  });
  