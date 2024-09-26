const { Bill, ReturnBill, Item } = require('../db-models');
const { ObjectId } = require('mongodb');

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
      amountReturn,
     } = req.body;

    const existingBill = await Bill.findById(id);

    if (!existingBill) {
      res
        .status(400)
        .json({ message: "Bill doesn't exist to apply return or exchange" });
      return;
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

    let newBillItems = [];
    if(existingBill.items && existingBill.items.length){
      for (let i = 0; i < existingBill.items.length; i++) {
        const { itemDetail: itemId, itemQuantityInBill } = existingBill.items[i] || {};
        if(returnItems.hasOwnProperty(itemId)){
          const returnQuantity = Number(returnItems[itemId]);
          if( returnQuantity && returnQuantity > itemQuantityInBill ||
            returnQuantity === 0){
            res.status(400).json({ message: 'Returning item quantity mismatch' });
            return;
          } else {
            const item = returnedItems.find(item =>
              item.itemDetail._id === itemId.toString()
            )
            const newOjectId = ObjectId(item.itemDetail._id);
            if((itemQuantityInBill - item.itemQuantityInBill) > 0){
              newBillItems.push({
                itemDetail: newOjectId,
                itemQuantityInBill: itemQuantityInBill - item.itemQuantityInBill,
                itemMRPtotal: item.itemMRPtotal,
                itemDiscountTotal: item.itemDiscountTotal,
                itemSellingPriceTotal: item.itemSellingPriceTotal
              });
            }
          }
        } else {
          newBillItems.push(existingBill.items[i]);
        }
      }
    }

    const newFilterBillItems = newBillItems.filter(item=>item.itemQuantityInBill > 0);

    await Promise.all(
      Object.entries(returnItems).map(async ([id, quantity]) => {
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
      billItems: [...newFilterBillItems, ...itemsExchanged],
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
      existingbillAmountTotal: existingBill.billAmountTotal,
      billId: id
    });
    existingBill.returnBills.push(newReturnBill._id);
    await existingBill.save();
    res.status(200).json({ message: newReturnBill });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { addNewReturnBill };
