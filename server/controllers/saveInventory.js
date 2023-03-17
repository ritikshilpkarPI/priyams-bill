const { Item} = require('../db-models/item-model');

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

  module.exports = {
    saveInventory,
  };