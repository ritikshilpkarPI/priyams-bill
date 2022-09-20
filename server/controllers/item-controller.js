const { Item } = require("../db-models/item-model");

const getItemsFeed = async (req, res) => {
  try {
    const reqFilters = JSON.parse(req.query.filters);
    let items = [];
    if (reqFilters.isDeleted === false) {
      items = await Item.find();
      items = items.filter((item) => !item.isDeleted);
    }
    if (reqFilters.minStockOnly) {
      items = await Item.find({
        minStockReached: reqFilters.minStockOnly,
        isDeleted: reqFilters.isDeleted,
      }).sort({ itemStockQuantity: 1 });
      items = items.filter((item) => !item.isDeleted);
    }
    const itemCount = items.length;
    res.status(200).json({ message: { items, itemCount } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const addItems = async (req, res) => {
  const {
    itemBarcode,
    itemName,
    itemMRPperUnit,
    itemCostPricePerUnit,
    itemSellingPricePerUnit,
    itemStockQuantity,
    minimumStockQuantity,
    slabPricing = [],
  } = req.body;

  try {
    if (
      !itemCostPricePerUnit ||
      !itemMRPperUnit ||
      !itemName ||
      !itemSellingPricePerUnit ||
      !itemStockQuantity ||
      !minimumStockQuantity
    ) {
      return res
        .status(501)
        .json({ status: false, message: "Fill all required fields" });
    }

    console.log(req.body);

    const newItem = await new Item({
      itemBarcode,
      itemName,
      itemStockQuantity,
      minimumStockQuantity,
      itemMRPperUnit,
      itemDiscountPerUnit: itemMRPperUnit - itemSellingPricePerUnit,
      itemPerUnitDiscountPercentage:
        ((itemMRPperUnit - itemSellingPricePerUnit) / itemMRPperUnit) * 100,
      itemCostPricePerUnit,
      itemSellingPricePerUnit,
      slabPricing,
    }).save();
    console.log('New Item', newItem);
    res.status(200).json({ status: true, message: newItem });
  } catch (error) {
    res.status(500).json({ error });
  }
};

const editItemById = async (req, res) => {
  try {
    const { id, itemToBeUpdated } = req.body;
    console.log(id, itemToBeUpdated);
    const changedItem = await Item.findByIdAndUpdate(id, itemToBeUpdated, {
      new: true,
    });
    res.status(200).json({ message: changedItem });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const softDeleteItem = async (req, res) => {
  try {
    const { id } = req.body;
    await Item.findByIdAndUpdate(id, { isDeleted: true });
    let items = await Item.find();
    items = items.filter((item) => !item.isDeleted);
    res.status(200).json({ message: "item soft deleted!", items: items });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = {
  getItemsFeed,
  addItems,
  editItemById,
  softDeleteItem,
};
