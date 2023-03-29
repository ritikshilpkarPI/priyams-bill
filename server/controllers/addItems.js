const { Item } = require('../db-models/item-model');


const addItems = async (req, res) => {
  const {
    itemBarcode,
    itemName,
    itemCategory,
    itemPerUnitQuantity,
    quantityUnitName,
    itemMRPperUnit,
    itemCostPricePerUnit,
    itemSellingPricePerUnit,
    itemStockQuantity,
    minimumStockQuantity,
    itemBrandName,
    useByDate,
    slabPricing = [],
  } = req.body;

  try {
    if (
      !itemCostPricePerUnit ||
      !itemMRPperUnit ||
      !itemName ||
      !itemSellingPricePerUnit ||
      !itemStockQuantity ||
      !minimumStockQuantity ||
      !itemCategory ||
      !quantityUnitName
    ) {
      return res
        .status(501)
        .json({ status: false, message: 'Fill all required fields' });
    }

    const newItem = await new Item({
      itemBarcode,
      itemBrandName,
      itemName,
      itemCategory,
      itemPerUnitQuantity,
      quantityUnitName,
      itemStockQuantity,
      minimumStockQuantity,
      itemMRPperUnit,
      useByDate,
      itemDiscountPerUnit: itemMRPperUnit - itemSellingPricePerUnit,
      itemPerUnitDiscountPercentage:
        ((itemMRPperUnit - itemSellingPricePerUnit) / itemMRPperUnit) * 100,
      itemCostPricePerUnit,
      itemSellingPricePerUnit,
      slabPricing,
    }).save();
    res.status(200).json({ status: true, message: newItem });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = addItems;
