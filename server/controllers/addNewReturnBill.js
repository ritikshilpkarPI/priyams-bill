const { Bill, ReturnBill, Item } = require('../db-models');
const { findBillById, calculateFinalItems, getMergedItemMap } = require('./getBillForReturnExchange');

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
    let existingBill = await findBillById(id);

    if (!existingBill) {
      const returnBill = await ReturnBill.findById(id);
      if (!returnBill) {
        res.status(400).json({ message: "Bill doesn't exist to apply return or exchange" });
        return;
      }
      existingBill = await findBillById(returnBill.billId);
      originalBillId = existingBill._id;
    }

    if (!returnedItems.length) {
      res
        .status(400)
        .json({ message: 'Add atleast one returning item in the bill' });
      return;
    }

    const returnItems = {};
    returnedItems.forEach(({itemDetail, itemQuantityInBill})=>{
      returnItems[itemDetail._id] = itemQuantityInBill
    });

    const allReturnedItems = [];
    const allAddedItems = existingBill.items;

    if (existingBill.returnBills.length > 0) {
      existingBill.returnBills.forEach(({ 
        itemsReturned, items 
      }) => {
        allAddedItems.push(...items);
        allReturnedItems.push(...itemsReturned);
      });
    }

    const returnedItemsMap = getMergedItemMap(allReturnedItems);
    const addedItemsMap = getMergedItemMap(allAddedItems);

    const { items } = calculateFinalItems(
      Object.values(addedItemsMap),
      returnedItemsMap
    );

    if(items.length > 0){
      for (let i = 0; i < items.length; i++) {
        const { itemDetail: itemId, itemQuantityInBill } = items[i] || {};
        if(returnItems[itemId]){
          const returnQuantity = Number(returnItems[itemId]);
          if( returnQuantity && (returnQuantity > itemQuantityInBill) ||
            returnQuantity === 0){
            res.status(400).json({ 
              message: 'Returning item quantity mismatched' 
            });
            return;
          }
        }
      }
    }

    await Promise.all(
      Object.entries(returnItems)
      .map(async ([id, quantity]) => {
        if (id) {
          const item = await Item.findById(id);
          if (!item.itemStockQuantity) {
            item.itemStockQuantity = Number(quantity);
          } else {
            item.itemStockQuantity += Number(quantity);
          }
          await item.save();
        }
      })
    );

    let totalBillProfit = 0,
      totalNumberOfItems = 0,
      totalNumberOfUniqueItems = billItems.length;

    const itemsExchanged = await Promise.all(
      billItems.map(async (itemObj) => {
        const {
          _id,
          itemSellingPricePerUnit,
          itemCostPricePerUnit,
          itemMRPperUnit,
          itemStockQuantity,
          itemDiscountPerUnit =  itemMRPperUnit - itemSellingPricePerUnit,
          ...restItemDetails
        } = itemObj.itemDetail;

        const orderQuantityInNumber = itemObj.itemQuantityInBill;
        totalNumberOfItems += orderQuantityInNumber;

        const itemNetProfit =
          (itemSellingPricePerUnit - itemCostPricePerUnit) *
          orderQuantityInNumber;
        totalBillProfit += itemNetProfit;

        if (_id) {
          const item = await Item.findById(_id);
          if (!item.itemStockQuantity) {
            item.itemStockQuantity = 0;
          } else {
            item.itemStockQuantity -= orderQuantityInNumber;
          }
          await item.save();
        }

        const item = {
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
        return item;
      })
    );

    const newReturnBill = await ReturnBill.create({
      customerName: existingBill.customerName,
      customerPhone: existingBill.customerPhone,
      items: itemsExchanged,
      itemsReturned: returnedItems,
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
      billId: id
    });

    await Bill.findByIdAndUpdate(originalBillId,{
      $push: { returnBills: originalBillId }
    });

    res.status(200).json({ message: newReturnBill });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { addNewReturnBill };
