const { Bill } = require('../db-models/bill-model');
const { Item } = require('../db-models/item-model');

const addNewBill = async (req, res,next) => {
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
    next(error)
  }
};


module.exports = addNewBill;
