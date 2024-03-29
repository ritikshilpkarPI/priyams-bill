const itemsByBarcode = {};
const useBarcodeSearchItems = (searchValue, itemsList) => {
  const filteredItemsByBarcode = itemsList.filter(
    (item) =>
      String(item.itemBarcode) &&
      String(searchValue) &&
      String(item.itemBarcode).includes(String(searchValue))
  );
  if (!Object.keys(itemsByBarcode).length) {
    itemsList.forEach((obj) => {
      if (obj['itemBarcode']) {
        itemsByBarcode[obj['itemBarcode']] = { ...obj };
      }
    });
  }
  const barcodeFilteredItem = { ...itemsByBarcode[searchValue] };
  return {
    barcodeFilteredItem,
    filteredItemsByBarcode,
  };
};

export default useBarcodeSearchItems;
