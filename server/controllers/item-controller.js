const { Item } = require("../db-models/item-model");

const getItemsFeed = async (req, res) => {
  try {
    const items = await Item.find();
    // find({ isDeleted: false });
    const itemCount = await Item.countDocuments();
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
  } = req.body;

  try {
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
    }).save();
    res.status(200).json({ message: newItem });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const editItemById = async (req, res) => {
  try {
    const { id, itemToBeUpdated } = req.body;
    const changedItem = await Item.findByIdAndUpdate(id, itemToBeUpdated, {
      new: true,
    });
    res.status(200).json({ message: changedItem });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const softDeleteItem = async (req, res) => {
  console.log(req.body.id);
  try {
    const { id } = req.body;
    await Item.findByIdAndUpdate(id, { isDeleted: true });
    const items = await Item.find({ isDeleted: false });
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
