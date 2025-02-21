const { Bill, ReturnItem, Item } = require('../db-models');
const {
  findBillById,
  calculateFinalItems,
  getMergedItemMap,
} = require('./getBillForReturnExchange');

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

    let originalBillId = id;
    let existingBill = await findBillById(originalBillId);

    if (!existingBill) {
      return res.status(400).json({ message: "Bill doesn't exist to apply return or exchange" });
    }

    if (!returnedItems.length) {
      return res.status(400).json({ message: 'Add at least one returning item in the bill' });
    }

    const returnItems = {};
    returnedItems.forEach(({ itemDetail, itemQuantityInBill }) => {
      returnItems[itemDetail._id] = itemQuantityInBill;
    });

    await Promise.all(
      Object.entries(returnItems).map(async ([id, quantity]) => {
        if (id) {
          const item = await Item.findById(id);
          item.itemStockQuantity = (item.itemStockQuantity || 0) + Number(quantity);
          await item.save();
        }
      })
    );

    let totalBillProfit = 0, totalNumberOfItems = 0, totalNumberOfUniqueItems = billItems.length;

    const itemsExchanged = await Promise.all(
      billItems.map(async (itemObj) => {
        const {
          _id,
          itemSellingPricePerUnit,
          itemCostPricePerUnit,
          itemMRPperUnit,
          itemStockQuantity,
          itemDiscountPerUnit = itemMRPperUnit - itemSellingPricePerUnit,
          ...restItemDetails
        } = itemObj.itemDetail;

        const orderQuantityInNumber = itemObj.itemQuantityInBill;
        totalNumberOfItems += orderQuantityInNumber;

        const itemNetProfit =
          (itemSellingPricePerUnit - itemCostPricePerUnit) * orderQuantityInNumber;
        totalBillProfit += itemNetProfit;

        if (_id) {
          const item = await Item.findById(_id);
          item.itemStockQuantity = (item.itemStockQuantity || 0) - orderQuantityInNumber;
          await item.save();
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
          itemSellingPriceTotal: itemSellingPricePerUnit * orderQuantityInNumber,
        };
      })
    );

    const newBill = await Bill.create({
      customerName: existingBill.customerName,
      customerPhone: existingBill.customerPhone,
      items: itemsExchanged,
      billMRPTotal,
      billAmountTotal,
      billDiscountTotal,
      totalBillProfit,
      totalNumberOfUniqueItems,
      totalNumberOfItems,
      cashPay,
      upiPay,
      amountReturn,
      refundAmount,
      totalRefundAmount,
      parentBillId: originalBillId,
      billRefund: refundAmount,
    });

    await ReturnItem.create({
      originalBillId,
      returnedItems,
      exchangeBillId: newBill._id,
    });

    res.status(200).json({ message: newBill });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { addNewReturnBill };
