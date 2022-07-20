const { Bill } = require("../db-models/bill-model");
const mongoose = require("mongoose");

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

    const allItems = billItems.map((itemObj) => {
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

      const orderQuantityInNumber = Number(OrderQuantity);
      totalNumberOfItems += orderQuantityInNumber;
      return {
        itemDetail: {
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
        },
        itemQuantityInBill: orderQuantityInNumber,
        itemMRPtotal: itemMRPperUnit * orderQuantityInNumber,
        itemDiscountTotal: itemDiscountPerUnit * orderQuantityInNumber,
        itemSellingPriceTotal: itemSellingPricePerUnit * orderQuantityInNumber,
      };
    });
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
      .sort({ createdAt: -1 });
    // console.log({ allBill });
    const billCount = await Bill.countDocuments();
    res.status(200).json({ message: { allBill, billCount } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addNewBill,
  getAllBill,
};
