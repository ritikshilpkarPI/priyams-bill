export const getItemNameByItem = (itemData) => {
    const {
      subCategory,
      brand,
      unit,
      flavourOrFeature,
      itemQuantity,
      mrp,
    } = itemData;
    return `
    ${brand ? `${brand} - ` : ''} ${
      subCategory ? `${subCategory} - ` : ''
    }${flavourOrFeature ? `${flavourOrFeature} - ` : ''}${itemQuantity || ''}${
      unit ? `${unit} - ` : '-'
    } Rs ${mrp}`;
  };
  