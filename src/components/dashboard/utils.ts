export const formatDateForAPI = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateForLabel = (date: Date) =>
  date
    .toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    })
    .replace(/,/g, '');

export const formatDateForCSV = (date: Date) =>
  formatDateForLabel(date).replace(/ /g, '-').toLowerCase();

export const isDateRangeComplete = (range: [Date | null, Date | null]): range is [Date, Date] =>
  Array.isArray(range) && range[0] instanceof Date && range[1] instanceof Date;

export const filterTableData = (data: any[] | undefined, searchTerm: string, isNested: boolean = false) => {
  if (!data) return undefined;
  if (!searchTerm) return data;
  
  const searchLower = searchTerm.toLowerCase();
  
  if (isNested) {
    return data.filter(item => {
      // Check if any product in topProducts matches the search
      return item.topProducts.some((product: any) => 
        (product.sku?.toLowerCase().includes(searchLower)) ||
        (product.barcode?.toLowerCase().includes(searchLower))
      );
    });
  }
  
  return data.filter(item => 
    (item.sku?.toLowerCase().includes(searchLower)) ||
    (item.barcode?.toLowerCase().includes(searchLower)) ||
    (item.itemName?.toLowerCase().includes(searchLower))
  );
}; 