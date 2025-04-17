export const transformItemDataToTableRows = (itemData: any): any[] => {
    const rows: any[] = [];
  
    Object.keys(itemData).forEach((skuKey) => {
      const item = itemData[skuKey];
      const staticData = item.staticData;
  
      item.purchases.forEach((purchase: any, index: number) => {
        rows.push({
          id: `${staticData._id}-${index}`,
          ...purchase,
          staticData,
          itemName: staticData.itemName,
          sku: staticData.sku,
          itemBarcode: staticData.itemBarcode,
          companyName: staticData.companyName,
          brandName: staticData.itemBrandName,
          category: staticData.itemCategory,
          quantityUnit: staticData.quantityUnitName,
          image: staticData.images?.[0] || null,
        });
      });
    });
  
    return rows;
  };
  