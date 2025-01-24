export const getItemNameByItem = (itemData) => {
  const {
    brand,
    unit,
    subCategory,
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
