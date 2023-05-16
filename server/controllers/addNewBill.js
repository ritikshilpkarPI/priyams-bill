const { Bill } = require('../db-models/bill-model');
const { Item } = require('../db-models/item-model');

const addNewBill = async (req, res, next) => {
  let attemptCount = 0;
  let newBill;
  const addBillFunction = async () => {
    // try {
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
          itemQuantityInBill,
          itemSellingPricePerUnit,
          itemCostPricePerUnit = 0,
          itemMRPperUnit,
          itemStockQuantity,
          itemDiscountPerUnit,
          ...restItemDetails
        } = itemObj.itemDetail;

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
            _id,
            itemStockQuantity,
            itemCostPricePerUnit,
            itemSellingPricePerUnit,
            itemMRPperUnit,
            itemDiscountPerUnit,
            ...restItemDetails,
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
    newBill = new Bill({
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
    // res.status(200).json({ message: newBill });
  };
  while (attemptCount <= 4) {
    try {
      ++attemptCount;
      await addBillFunction();
      return res.status(200).json({ message: newBill, attemptCount });
    } catch (error) {
      console.log({ error });
      if (attemptCount > 3) return next({ error, attemptCount });
    }
  }
  // catch (error) {
  //   next(error)
  // }
};

module.exports = addNewBill;
