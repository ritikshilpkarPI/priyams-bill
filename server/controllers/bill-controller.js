const { Bill } = require("../db-models/bill-model");
const { Item } = require("../db-models/item-model");
const { DailyBill } = require("../db-models/dailybill-model");

const addNewBill = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      billMRPTotal,
      billAmountTotal,
      billDiscountTotal,
      billItems,
      cashPay,
      upiPay,
      amountReturn,
    } = req.body;

    let [
      // billPercentageDiscountTotal,
      totalNumberOfUniqueItems,
      totalNumberOfItems,
      totalBillProfit,
    ] = [billItems.length, 0, 0];

    const allItems = await Promise.all(
      billItems.map(async (itemObj) => {
        const {
          _id,
          itemName,
          itemBarcode,
          itemStockQuantity,
          minimumStockQuantity,
          itemMRPperUnit,
          itemCostPricePerUnit = 0,
          itemDiscountPerUnit,
          itemPerUnitDiscountPercentage,
          itemSellingPricePerUnit,
          createdAt,
          itemQuantityInBill,
        } = itemObj.itemDetail;
        let item = undefined;
        if (!_id) {
          const newItem = new Item({
            itemName,
            itemBarcode,
            itemStockQuantity,
            minimumStockQuantity,
            itemMRPperUnit,
            itemCostPricePerUnit,
            itemDiscountPerUnit,
            itemPerUnitDiscountPercentage,
            itemSellingPricePerUnit,
            createdAt,
          });
          const newItemSaved = await newItem.save();
          item = newItemSaved;
        }

        const orderQuantityInNumber = Number(itemQuantityInBill);
        totalNumberOfItems += orderQuantityInNumber;

        const itemNetProfit =
          (itemSellingPricePerUnit - itemCostPricePerUnit) *
          orderQuantityInNumber;
        totalBillProfit += itemNetProfit;

        if (_id) {
          const item = await Item.findById(_id);
          if (!item.itemStockQuantity) {
            item.itemStockQuantity = 0;
            await item.save();
          } else {
            item.itemStockQuantity -= orderQuantityInNumber;
            await item.save();
          }
        }

        return {
          itemDetail: {
            _id: _id || item._id,
            itemName,
            itemBarcode,
            itemStockQuantity,
            minimumStockQuantity,
            itemMRPperUnit,
            itemCostPricePerUnit,
            itemDiscountPerUnit,
            itemPerUnitDiscountPercentage,
            itemSellingPricePerUnit,
            createdAt,
          },
          itemNetProfit,
          itemQuantityInBill: orderQuantityInNumber,
          itemMRPtotal: itemMRPperUnit * orderQuantityInNumber,
          itemDiscountTotal: itemDiscountPerUnit * orderQuantityInNumber,
          itemSellingPriceTotal:
            itemSellingPricePerUnit * orderQuantityInNumber,
        };
      })
    );
    const newBill = new Bill({
      customerName,
      customerPhone,
      items: allItems,
      billMRPTotal,
      billAmountTotal,
      billDiscountTotal,
      // billPercentageDiscountTotal,
      totalBillProfit,
      totalNumberOfUniqueItems,
      totalNumberOfItems,
      cashPay,
      upiPay,
      amountReturn,
    });
    await newBill.save();
    res.status(200).json({ message: newBill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getAllBill = async (req, res) => {
  try {
    const allBill = await Bill.find()
      .populate({
        path: "items",
        populate: {
          path: "itemDetail",
          model: "Item",
        },
      })
      .sort({ createdAt: -1 })
      .limit(Number(req.query.size));
    // .skip(Number(req.query.size) * Number(req.query.page))
    const billCount = await Bill.countDocuments();
    res.status(200).json({ message: { allBill, billCount } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
const getEditBill = async (req, res) => {
  try {
    const id = req.params.id;
    const bill = await Bill.findById(id).populate({
      path: "items",
      populate: {
        path: "itemDetail",
        model: "Item",
      },
    });

    res.status(200).json({ message: bill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getDayWiseBills = async (req, res) => {
  try {
    const allDailyBills = await Bill.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalNumberOfBillsForToday: {
            $sum: 1,
          },
          totalBillAmount: {
            $sum: "$billAmountTotal",
          },
          totalMRPAmount: {
            $sum: "$billMRPTotal",
          },
          totalDiscountAmount: {
            $sum: "$billDiscountTotal",
          },
          totalItemBilled: {
            $sum: "$totalNumberOfUniqueItems",
          },
          totalQuantityBilled: {
            $sum: "$totalNumberOfItems",
          },
          totalDailyProfit: {
            $sum: "$totalBillProfit",
          },
          totalCashPay: {
            $sum: "$cashPay",
          },
          totalUpiPay: {
            $sum: "$upiPay",
          },
          totalAmountReturn: {
            $sum: "$amountReturn",
          },
        },
      },
    ]).sort({ _id: -1 });
    const dailyBillCount = await DailyBill.countDocuments();
    res.status(200).json({ message: { allDailyBills, dailyBillCount } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const editBill = async (req, res) => {
  try {
    const { id, itemWithChanges } = req.body;
    const { billItems, ...billObject } = itemWithChanges;
    const billObjectWithItems = { ...billObject, items: billItems };
    const prevBill = await Bill.findById(billObjectWithItems._id);
    billObjectWithItems.items = await Promise.all(
      billObjectWithItems.items.map(async (billItem) => {
        const item = await Item.findById(billItem.itemDetail._id);
        const itemInPrevBilll = prevBill.items.find((itemObj) => {
          console.log({ itemObj });
          return itemObj.itemDetail._id === item._id;
        });
        console.log({ billItem, item, itemInPrevBilll, prevBill });
        if (itemInPrevBilll) {
          item.itemStockQuantity += itemInPrevBilll.itemQuantityInBill;
          item.itemStockQuantity -= billItem.itemQuantityInBill;
          await item.save();
        } else {
          if (!item.itemStockQuantity) {
            item.itemStockQuantity = 0;
            await item.save();
          } else {
            item.itemStockQuantity -= orderQuantityInNumber;
            await item.save();
          }
        }
      })
    );
    console.log({ billObjectWithItems: JSON.stringify(billObjectWithItems) });
    const changeBill = await Bill.findByIdAndUpdate(id, billObjectWithItems, {
      new: true,
    }).populate({
      path: "items",
      populate: {
        path: "itemDetail",
        model: "Item",
      },
    });

    res.status(200).json({ message: changeBill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addNewBill,
  getAllBill,
  getDayWiseBills,
  getEditBill,
  editBill,
};
