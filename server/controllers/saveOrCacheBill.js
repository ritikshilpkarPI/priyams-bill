const { Bill } = require('../db-models/bill-model');
const { Item } = require('../db-models/item-model');
const { UnSavedBill } = require('../db-models/unSavedBill-model');

const { v4: uuidv4 } = require('uuid');
const {
  setToBillsCache,
  deleteBillFromBillCacheById,
} = require('../cache/billCacheConfig');
const { SentMessageToDiscord } = require('../util');

const saveOrCacheBill = async (req, res) => {
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
    billId =  `${uuidv4()}-${Date.now()}`,
  } = req.body;
  const newBillData = {
    customerName,
    customerPhone,
    billMRPTotal,
    billAmountTotal,
    billDiscountTotal,
    billItems,
    cashPay,
    upiPay,
    amountReturn,
  };
  let isBillSaved, billBarcode;
  try {
    const maxAttemptToSaveInDB = 3;
    setToBillsCache(billId, newBillData);
    const duplicateBill = await Bill.findOne({slug: billId});
    if(duplicateBill){
      isBillSaved = true;
      res.status(409).json({ message: "This bill already exist with same slug" });
      return ;
    }
    const billSaved = await saveBill(newBillData, billId, maxAttemptToSaveInDB);
    isBillSaved = billSaved.isBillSaved;
    billBarcode = billSaved.billBarcode;
  } catch (error) {
    
    SentMessageToDiscord(JSON.stringify(error))
    console.log(error);
  } finally {
    if (isBillSaved) {
      deleteBillFromBillCacheById(billId);
      res.status(200).json({
        success: true,
        message: 'Bill saved successfully!',
        billId,
        isBillSaved,
        billBarcode,
        isUnsavedBillCreated: false,
        isCached: false,
      });
    } else {
      const isUnsavedBillCreated = await saveBillToUnsavedBills({
        billData: newBillData,
        billId,
      });
      res.status(200).json({
        success: false,
        message: 'Unable to save bill',
        billId,
        isBillSaved,
        billBarcode,
        isUnsavedBillCreated,
        isCached: true,
      });
    }
  }
};

const saveBill = async (
  newBillData,
  billId,
  maxAttemptToSaveInDB,
  currentAttempt = 0
) => {
  if (currentAttempt > maxAttemptToSaveInDB) {
    return {isBillSaved: false, billBarcode: ''};
  } else {
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
      } = newBillData;
      let totalNumberOfUniqueItems = billItems.length,
        totalNumberOfItems = 0,
        totalBillProfit = 0;
      const allItems = await Promise.all(
        billItems.map(async (itemObj) => {
          const {
            _id,
            itemSellingPricePerUnit,
            itemCostPricePerUnit = 0,
            itemMRPperUnit,
            itemStockQuantity,
            itemDiscountPerUnit = 0,
            ...restItemDetails
          } = itemObj.itemDetail;

          const orderQuantityInNumber = Number(
            itemObj ? itemObj.itemQuantityInBill : 0
          );
          totalNumberOfItems += orderQuantityInNumber;

          const itemNetProfit =
            (itemSellingPricePerUnit - itemCostPricePerUnit) *
            orderQuantityInNumber;
          totalBillProfit += itemNetProfit;
          let item;
          if (_id) {
            try {
              item = await Item.findById(_id);
              if (item) {
                item.itemStockQuantity = Math.max(
                  0,
                  (item.itemStockQuantity || 0) - orderQuantityInNumber
                );
                await item.save();
              }
            } catch (error) {
              SentMessageToDiscord(JSON.stringify(error))
            }
          }
          if (!item) {
            throw new Error('item not exists');
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

      const newBill = await Bill.create({
        customerName,
        customerPhone,
        items: allItems,
        slug: billId,
        billMRPTotal,
        billAmountTotal,
        billDiscountTotal,
        totalBillProfit,
        totalNumberOfUniqueItems,
        totalNumberOfItems,
        cashPay,
        upiPay,
        amountReturn,
      });
      return {isBillSaved: true, billBarcode: newBill._id};
    } catch (error) {
      return await saveBill(
        newBillData,
        billId,
        maxAttemptToSaveInDB,
        currentAttempt + 1
      );
    }
  }
};

const saveBillToUnsavedBills = async (data) => {
  try {
    await UnSavedBill.create({ data });
    return true;
  } catch (error) {
    SentMessageToDiscord(JSON.stringify(error))
    return false;
  }
};

module.exports = saveOrCacheBill;
