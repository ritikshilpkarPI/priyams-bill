export const getItemNameByItem = (itemData) => {
  const {
    subCategory,
    brand,
    unit,
    featureOrFlavour,
    stockQuantity,
    mrp,
  } = itemData;
  return `
  ${brand ? `${brand} - ` : ''} ${
    subCategory ? `${subCategory} - ` : ''
  }${featureOrFlavour ? `${featureOrFlavour} - ` : ''}${stockQuantity || ''}${
    unit ? `${unit} - ` : '-'
  } Rs ${mrp}`;
};
