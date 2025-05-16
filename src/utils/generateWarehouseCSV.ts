function formatDate(dateStr?: string): string {
  return dateStr ? new Date(dateStr).toISOString().split('T')[0] : '';
}

export function generateWarehouseCSV(data: any[]): string {
  const headers = [
    'ID',
    'Barcode',
    'Name',
    'QuantityPerUnit',
    'Unit',
    'MRP',
    'Brand',
    'Category',
    'SubCategory',
    'Company',
    'SKU',
    'SaleTime',
    'Shelf_ExpiryDate',
    'Shelf_MfgDate',
    'Shelf_EntryDate',
    'Shelf_Quantity',
  ];

  const csvRows: string[] = [headers.join(',')];

  data.forEach((item) => {
    const shelves = item.itemShelfDates || [];

    if (shelves.length === 0) {
      // No shelf data; output item details with empty shelf fields
      const row = [
        item._id,
        item.itemBarcode,
        item.itemName,
        item.itemPerUnitQuantity,
        item.quantityUnitName,
        item.itemMRPperUnit,
        item.itemBrandName,
        item.itemCategory,
        item.subCategory,
        item.companyName,
        item.sku,
        item.saleTime,
        '', // Shelf_ExpiryDate
        '', // Shelf_MfgDate
        '', // Shelf_EntryDate
        '', // Shelf_Quantity
      ].map((field) => JSON.stringify(field ?? '')).join(',');

      csvRows.push(row);
    } else {
      // Output item details with the first shelf entry
      const firstShelf = shelves[0];
      const firstRow = [
        item._id,
        item.itemBarcode,
        item.itemName,
        item.itemPerUnitQuantity,
        item.quantityUnitName,
        item.itemMRPperUnit,
        item.itemBrandName,
        item.itemCategory,
        item.subCategory,
        item.companyName,
        item.sku,
        item.saleTime,
        formatDate(firstShelf?.expiryDate),
        formatDate(firstShelf?.manufacturingDate),
        formatDate(firstShelf?.entryDate),
        firstShelf?.quantity ?? '',
      ].map((field) => JSON.stringify(field ?? '')).join(',');

      csvRows.push(firstRow);

      // Output remaining shelf entries with empty item fields
      for (let i = 1; i < shelves.length; i++) {
        const shelf = shelves[i];
        const shelfRow = [
          '', '', '', '', '', '', '', '', '', '', '', '', // Empty item fields
          formatDate(shelf?.expiryDate),
          formatDate(shelf?.manufacturingDate),
          formatDate(shelf?.entryDate),
          shelf?.quantity ?? '',
        ].map((field) => JSON.stringify(field ?? '')).join(',');

        csvRows.push(shelfRow);
      }
    }
  });

  return csvRows.join('\n');
}
