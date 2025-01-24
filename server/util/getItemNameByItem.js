export const getItemNameByItem = (itemData) => {
    const {
      companyName,
      category,
      subCategory,
      brand,
      unit,
      featureOrFlavour,
      stockQuantity,
      mrp,
    } = itemData;
    return `
    ${companyName ? `${companyName} - ` : ''}
    ${brand ? `${brand} - ` : ''}${category ? `${category} - ` : ''} ${
      subCategory ? `${subCategory} - ` : ''
    }${featureOrFlavour ? `${featureOrFlavour} - ` : ''}${stockQuantity || ''}${
      unit ? `${unit} - ` : '-'
    }${mrp}`;
  };
  