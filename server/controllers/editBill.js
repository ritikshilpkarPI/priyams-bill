const { Bill } = require('../db-models/bill-model');
const { Item } = require('../db-models/item-model');

const editBill = async (req, res) => {
    try {
      const { id, itemWithChanges } = req.body;
      const { billItems, ...billObject } = itemWithChanges;
      const billObjectWithItems = { ...billObject, items: billItems };
      const { _id, createdAt, updatedAt, __v, ...billWithoutDbConstants } =
        billObjectWithItems;
      const prevBill = await Bill.findById(id).populate({
        path: 'items',
        populate: {
          path: 'itemDetail',
          model: 'Item',
        },
      });
      prevBill.items.map(async (prev) => {
        const newItem = billItems.filter(
          (item) => String(item._id) === String(prev._id)
        );
        if (!newItem.length) {
          const qnt = prev.itemQuantityInBill;
          let item = await Item.findById(prev.itemDetail._id);
          item.itemStockQuantity += qnt;
          await item.save();
        } else {
          let item = await Item.findById(prev.itemDetail._id);
          if (prev.itemQuantityInBill > newItem[0].itemQuantityInBill) {
            const qnt = prev.itemQuantityInBill - newItem[0].itemQuantityInBill;
            item.itemStockQuantity += qnt;
            await item.save();
          } else if (prev.itemQuantityInBill < newItem[0].itemQuantityInBill) {
            const qnt = newItem[0].itemQuantityInBill - prev.itemQuantityInBill;
            item.itemStockQuantity -= qnt;
            await item.save();
          }
        }
      });
      billItems.map(async (newItem) => {
        const oldItem = prevBill.items.filter(
          (item) => String(item._id) === String(newItem._id)
        );
        if (!oldItem.length) {
          const qnt = newItem.itemQuantityInBill;
          const item = await Item.findById(newItem.itemDetail._id);
          item.itemStockQuantity -= qnt;
          await item.save();
        }
      });
      const changeBill = await Bill.findByIdAndUpdate(
        id,
        billWithoutDbConstants,
        {
          new: true,
        }
      ).populate({
        path: 'items',
        populate: {
          path: 'itemDetail',
          model: 'Item',
        },
      });
  
      res.status(200).json({ message: changeBill });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  module.exports = {
    editBill,
  };
  