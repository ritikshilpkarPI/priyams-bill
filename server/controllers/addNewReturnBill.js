const { Bill, ReturnItem, Item } = require('../db-models');
const { findBillById } = require('./getBillForReturnExchange');

const addNewReturnBill = async (req, res, next) => {
  try {
    const {
      id,
      returnedItems = [],
      billMRPTotal,
      billAmountTotal,
      billDiscountTotal,
      billItems = [],
      cashPay,
      upiPay,
      refundAmount,
      totalRefundAmount,
      amountReturn,
    } = req.body;



    const existingBill = await findBillById(id);
    delete existingBill._id;

    if (!existingBill) {
      return res.status(400).json({ message: "Bill doesn't exist to apply return or exchange" });
    }

    const returnItemsMap = Object.fromEntries(returnedItems.map(({ itemDetail, itemQuantityInBill }) => [
      itemDetail._id, itemQuantityInBill
    ]));

    // Bulk update item stock
    const bulkStockUpdate = Object.entries(returnItemsMap).map(([itemId, quantity]) => ({
      updateOne: {
        filter: { _id: itemId },
        update: { $inc: { itemStockQuantity: quantity } }
      }
    }));

    await Item.bulkWrite(bulkStockUpdate);

    let totalBillProfit = 0, totalNumberOfItems = 0;
    const itemsExchanged = billItems.map(({ itemDetail, itemQuantityInBill }) => {
      const { _id, itemSellingPricePerUnit = 0, itemCostPricePerUnit = 0, itemMRPperUnit } = itemDetail;
      const itemDiscountPerUnit = itemMRPperUnit - itemSellingPricePerUnit;
      const itemNetProfit = (itemSellingPricePerUnit - itemCostPricePerUnit) * itemQuantityInBill;

      totalNumberOfItems += itemQuantityInBill;
      totalBillProfit += itemNetProfit;

      return {
        itemDetail: { _id, itemSellingPricePerUnit, itemCostPricePerUnit, itemMRPperUnit, itemDiscountPerUnit },
        itemNetProfit,
        itemQuantityInBill,
        itemMRPtotal: itemMRPperUnit * itemQuantityInBill,
        itemDiscountTotal: itemDiscountPerUnit * itemQuantityInBill,
        itemSellingPriceTotal: itemSellingPricePerUnit * itemQuantityInBill,
      };
    });

    // Create new bill with returned items
    const newBill = await Bill.create({
      ...existingBill,
      items: itemsExchanged,
      billMRPTotal,
      billAmountTotal,
      billDiscountTotal,
      totalBillProfit: totalBillProfit ?? 0,
      totalNumberOfUniqueItems: billItems.length,
      totalNumberOfItems,
      cashPay,
      upiPay,
      amountReturn,
      refundAmount,
      totalRefundAmount,
      parentBillId: id,
      billRefund: refundAmount,
    });

    // Create return item record
    await ReturnItem.create({ originalBillId: id, returnedItems, exchangeBillId: newBill._id });

    res.status(200).json({ message: newBill });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { addNewReturnBill };
