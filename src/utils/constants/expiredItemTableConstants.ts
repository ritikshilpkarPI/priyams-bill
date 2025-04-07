export const ExpiredItemTableConstants = Object.freeze({
  MANUFACTURING_DATE: 'manufacturingDate',
  EXPIRY_DATE: 'expiryDate',
  COLUMNS: [
    { label: 'Item Name', key: 'itemName', sortable: true },
    { label: 'Barcode', key: 'itemBarcode', sortable: true },
    { label: 'MRP', key: 'itemMRPperUnit', sortable: true },
    { label: 'CP', key: 'itemCostPricePerUnit', sortable: true },
    { label: 'SP', key: 'itemSellingPricePerUnit', sortable: true },
    {
      label: 'Manufacturing Date',
      key: 'manufacturingDate',
      sortable: true,
    },
    {
      label: 'Expiry Date',
      key: 'expiryDate',
      sortable: true,
    },
    { label: 'Expiry Qty', key: 'expiryQuantity', sortable: true },
  ],
});
