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
    } = req.body;

    let [
      // billPercentageDiscountTotal,
      totalNumberOfUniqueItems,
      totalNumberOfItems,
    ] = [billItems.length, 0];

    const allItems = await Promise.all(
      billItems.map(async (itemObj) => {
        const {
          _id,
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
          OrderQuantity,
        } = itemObj;
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

        const orderQuantityInNumber = Number(OrderQuantity);
        totalNumberOfItems += orderQuantityInNumber;
        // if (_id) {
        //   await Item.findByIdAndUpdate(
        //     _id,
        //     { $inc: { itemStockQuantity: -orderQuantityInNumber } },
        //     { new: true }
        //   );
        // }

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
      totalNumberOfUniqueItems,
      totalNumberOfItems,
    });
    const savedBill = await newBill.save();
    const todayBill = await DailyBill.findOne({
      billDate: new Date(savedBill.createdAt).getDate(),
    });
    if (todayBill) {
      ++todayBill.totalNumberOfBillsForToday,
        (todayBill.totalBillAmount += savedBill.billAmountTotal),
        (todayBill.totalMRPAmount += savedBill.billMRPTotal),
        (todayBill.totalDiscountAmount += savedBill.billDiscountTotal),
        (todayBill.totalItemBilled += savedBill.totalNumberOfUniqueItems),
        (todayBill.totalQuantityBilled += savedBill.totalNumberOfItems),
        todayBill.bills.push(savedBill);
      await todayBill.save();
    } else {
      const createTodaysBill = new DailyBill({
        totalNumberOfBillsForToday: 1,
        totalBillAmount: savedBill.billAmountTotal,
        totalMRPAmount: savedBill.billMRPTotal,
        totalDiscountAmount: savedBill.billDiscountTotal,
        totalItemBilled: savedBill.totalNumberOfUniqueItems,
        totalQuantityBilled: savedBill.totalNumberOfItems,
        billDate: new Date(savedBill.createdAt).getDate(),
        bills: [savedBill],
      });
      await createTodaysBill.save();
    }
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
      .sort({ createdAt: -1 });
    const billCount = await Bill.countDocuments();
    res.status(200).json({ message: { allBill, billCount } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getDayWiseBills = async (req, res) => {
  try {
    const allDailyBills = await DailyBill.find()
      .populate({
        path: "bills",
        model: "Bill",
        populate: {
          path: "items",
          populate: {
            path: "itemDetail",
            model: "Item",
          },
        },
      })
      .sort({ createdAt: -1 });
    const dailyBillCount = await DailyBill.countDocuments();
    res.status(200).json({ message: { allDailyBills, dailyBillCount } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addNewBill,
  getAllBill,
  getDayWiseBills,
};
