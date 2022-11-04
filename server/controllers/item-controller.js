const { Item } = require("../db-models/item-model");

const getItemsFeed = async (req, res) => {
  try {
    const reqFilters = JSON.parse(req.query.filters);
    let items = [];
    if (reqFilters.isDeleted === false) {
      items = await Item.find({}, null, { sort: { itemName: 1 } });
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
      !minimumStockQuantity
    ) {
      return res
        .status(501)
        .json({ status: false, message: "Fill all required fields" });
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

const addBulkItems = async (request, response) => {
  try {
    const csvData = request.body;
    const slabPricingStart = csvData[0].findIndex((item) => item === "tp1");
    const mrpprice = csvData[0].findIndex((item) => item === "itemMRPperUnit");
    const itemname = csvData[0].findIndex((item) => item === "itemName");
    const itembarcode = csvData[0].findIndex((item) => item === "itemBarcode");

    if (slabPricingStart === -1)
      return response
        .status(503)
        .json({
          status: false,
          message: "Uploaded sheet does not has tp1 column in its header",
        });
    await Promise.all(
      csvData.map(async (item, index) => {
        if (index !== 0) {
          const slabPricesArray = [];
          if (item[slabPricingStart]) {
            let j = 0;
            for (let i = slabPricingStart; i < item.length; i += 2) {
              if (item[i]) {
                slabPricesArray.push([
                  Number(j),
                  Number(item[i]),
                  Number(item[i + 1]),
                ]);
                j++;
              } else {
                break;
              }
            }
          }
          await Item.findOneAndUpdate(
            {
              itemName: item[itemname],
              itemBarcode: item[itembarcode],
              itemMRPperUnit: item[mrpprice],
            },
            { slabPricing: slabPricesArray }
          );
        }
      })
    );
    response.status(200).json({ status: true, message: "items added" });
  } catch (error) {
    response.status(500).json(error);
  }
};

module.exports = {
  getItemsFeed,
  addItems,
  editItemById,
  softDeleteItem,
  addBulkItems,
};
