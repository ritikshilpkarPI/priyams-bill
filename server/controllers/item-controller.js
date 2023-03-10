const { Item, inventoryItemCategory } = require('../db-models/item-model');

const getItemsFeed = async (req, res) => {
  try {
    const { minStockOnly = false, isDeleted = false } = JSON.parse(
      req.query.filters
    );
    let items = await Item.find({}, null, { sort: { itemName: 1 } });
    items = items.filter((item) => item.permanentlyOutOfStock === false);
    if (isDeleted === false) {
      items = items.filter((item) => !item.isDeleted);
    }
    if (minStockOnly) {
      items = items.filter(
        (item) =>
          Number(item.minimumStockQuantity) >= Number(item.itemStockQuantity)
      );
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

const editItemById = async (req, res) => {
  try {
    const { id, itemToBeUpdated } = req.body;
    const changedItem = await Item.findByIdAndUpdate(id, itemToBeUpdated, {
      new: true,
    });
    res.status(200).json({ message: changedItem });
  } catch (error) {
    console.error(error);
    res.status(501).json({ error });
  }
};

const softDeleteItem = async (req, res) => {
  try {
    const { id } = req.body;
    await Item.findByIdAndUpdate(id, { isDeleted: true });
    let items = await Item.find();
    items = items.filter((item) => !item.isDeleted);
    res.status(200).json({ message: 'item soft deleted!', items: items });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const addBulkItems = async (request, response) => {
  try {
    const csvData = request.body;
    const slabPricingStart = csvData[0].findIndex((item) => item === 'tp1');
    const mrpprice = csvData[0].findIndex((item) => item === 'itemMRPperUnit');
    const itemname = csvData[0].findIndex((item) => item === 'itemName');
    const itembarcode = csvData[0].findIndex((item) => item === 'itemBarcode');

    if (slabPricingStart === -1)
      return response.status(503).json({
        status: false,
        message: 'Uploaded sheet does not has tp1 column in its header',
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
    response.status(200).json({ status: true, message: 'items added' });
  } catch (error) {
    response.status(500).json(error);
  }
};

const saveInventory = async (req, res) => {
  try {
    const { new_items } = req.body;
    for (const item of new_items) {
      const itemDetails = {
        itemName: item.inputName,
        itemBarcode: item.barcode,
        itemStockQuantity: item.stockQuantity,
        minimumStockQuantity: item.minimumQuantity,
        itemMRPperUnit: item.mrp,
        itemCostPricePerUnit: item.costPrice,
        itemSellingPricePerUnit: item.sellingPrice,
        useByDate: item.expiryDates,
        slabPricing: item.slabPrice,
        quantityUnitName: item.unit,
        itemPerUnitQuantity: item.itemQuantity,
        itemBrandName: item.brand,
        itemCategory: item.category,
      };
      let oldItem;
      if (item.item_id) {
        oldItem = await Item.findById(item.item_id);
      }
      if (oldItem) {
        let newCostPrice =
          (oldItem.itemCostPricePerUnit * oldItem.itemStockQuantity +
            itemDetails.itemStockQuantity * itemDetails.itemCostPricePerUnit) /
          (oldItem.itemStockQuantity + itemDetails.itemStockQuantity);
        let newStock =
          itemDetails.itemStockQuantity + oldItem.itemStockQuantity;
        let newItemPerUnit =
          itemDetails.itemPerUnitQuantity + oldItem.itemPerUnitQuantity;

        let newUseByDate = [];
        itemDetails.useByDate.forEach((newData) => {
          let dateExists = false;
          oldItem.useByDate.forEach((oldData) => {
            if (
              new Date(oldData.date).toLocaleDateString() ===
              new Date(newData.date).toLocaleDateString()
            ) {
              dateExists = true;
              let totalExpiryItems = newData.value + oldData.value;
              newUseByDate = [
                ...newUseByDate,
                { date: newData.date, value: totalExpiryItems },
              ];
            }
          });
          if (!dateExists) {
            newUseByDate = [...newUseByDate, { ...newData }];
          }
        });
        oldItem.useByDate.forEach((oldData) => {
          let dateExists = false;
          itemDetails.useByDate.forEach((newData) => {
            if (
              new Date(oldData.date).toLocaleDateString() ===
              new Date(newData.date).toLocaleDateString()
            ) {
              dateExists = true;
            }
          });
          if (!dateExists) {
            newUseByDate = [...newUseByDate, { ...oldData }];
          }
        });
        let new_Item_Update = {
          ...itemDetails,
          itemCostPricePerUnit: newCostPrice.toFixed(2),
          useByDate: newUseByDate,
          itemStockQuantity: newStock,
          itemPerUnitQuantity: newItemPerUnit,
        };
        await oldItem.updateOne(
          {
            ...itemDetails,
            ...new_Item_Update,
          },
          {
            new: true,
          }
        );
      } else {
        await Item.create({ ...itemDetails });
      }
    }
    res.status(200).send({ message: 'items updated', success: true });
  } catch (err) {
    res.status(400).send({ message: err, success: false });
  }
};

const filterExpiryDates = async (req, res) => {
  const { startDate, endDate } = req.body;
  const splitDateInDbFormat = (date = 'dd/mm/yyyy') => {
    const [day, month, year] = date.split('/'); // = [01, 02, 2028]
    return new Date(Number(year), Number(month), Number(day));
  };
  try {
    const expiredItems = await Item.aggregate([
      { $project: { useByDate: 1, itemName: 1, itemBarcode: 1 } },
      { $unwind: '$useByDate' },
      {
        $match: {
          'useByDate.date': {
            $gte: splitDateInDbFormat(startDate),
            $lte: splitDateInDbFormat(endDate),
          },
        },
      },
      {
        $sort: {
          'useByDate.date': 1,
        },
      },
    ]);
    return res.status(200).json({ message: { expiredItems } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const permanentlyOutOfStock = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findByIdAndUpdate(
      id,
      {
        permanentlyOutOfStock: true,
      },
      {
        new: true,
      }
    );
    res.status(200).send({
      message: 'Item is successfully permanently out of stock ',
      success: true,
      item,
    });
  } catch (error) {
    res.status(400).send({ message: error, success: false });
  }
};

const getItemsCategoryList = async (req, res) => {
  try {
    return res.status(200).json({ message: { inventoryItemCategory } });
  } catch (error) {
    res.status(400).send({ message: error, success: false });
  }
};

module.exports = {
  getItemsFeed,
  addItems,
  editItemById,
  softDeleteItem,
  addBulkItems,
  saveInventory,
  filterExpiryDates,
  permanentlyOutOfStock,
  getItemsCategoryList,
};
