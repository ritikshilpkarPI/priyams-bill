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
    console.log({ req: req.body });

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
    });
    const savedBill = await newBill.save();

    console.log({ savedBill });
    const todayBill = await DailyBill.findOne({
      billDate: savedBill.createdAt.toDateString(),
    });
    console.log({ todayBill });
    if (todayBill) {
      ++todayBill.totalNumberOfBillsForToday,
        (todayBill.totalBillAmount += savedBill.billAmountTotal),
        (todayBill.totalMRPAmount += savedBill.billMRPTotal),
        (todayBill.totalDiscountAmount += savedBill.billDiscountTotal),
        (todayBill.totalItemBilled += savedBill.totalNumberOfUniqueItems),
        (todayBill.totalQuantityBilled += savedBill.totalNumberOfItems),
        todayBill.bills.push(savedBill);
      console.log("2", { todayBill });
      const todayBilPresentSaved = await todayBill.save();
      console.log({ todayBilPresentSaved });
    } else {
      const createTodaysBill = new DailyBill({
        totalNumberOfBillsForToday: 1,
        totalBillAmount: savedBill.billAmountTotal,
        totalMRPAmount: savedBill.billMRPTotal,
        totalDiscountAmount: savedBill.billDiscountTotal,
        totalItemBilled: savedBill.totalNumberOfUniqueItems,
        totalQuantityBilled: savedBill.totalNumberOfItems,
        bills: [savedBill],
      });
      const todayBillNewSaved = await createTodaysBill.save();
      console.log({ todayBillNewSaved });
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
        },
      },
      { $sort: { createdAt: -1 } },
    ]);
    // await DailyBill.find()
    //   .populate({
    //     path: "bills",
    //     model: "Bill",
    //     populate: {
    //       path: "items",
    //       populate: {
    //         path: "itemDetail",
    //         model: "Item",
    //       },
    //     },
    //   })
    //   .sort({ createdAt: -1 });
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
