export const getItemNameByItem = (itemData) => {
    const {
      subCategory,
      brand,
      unit,
      flavourOrFeature,
      stockQuantity,
      mrp,
    } = itemData;
    return `
    ${brand ? `${brand} - ` : ''} ${
      subCategory ? `${subCategory} - ` : ''
    }${flavourOrFeature ? `${flavourOrFeature} - ` : ''}${stockQuantity || ''}${
      unit ? `${unit} - ` : '-'
    } Rs ${mrp}`;
  };
  