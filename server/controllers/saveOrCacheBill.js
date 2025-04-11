const { Bill } = require('../db-models/bill-model');
const { UnSavedBill } = require('../db-models/unSavedBill-model');
const {
  setToBillsCache,
  deleteBillFromBillCacheById,
} = require('../cache/billCacheConfig');
const { logToDiscord } = require('../util/logToDiscord');
const { getStoreInventoryModel } = require('../db-models/storeInventory-model');

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
    billId,
    rzpPaymentId,
    isUpiAmtPaid,
    staffId,
    storeData
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
    slug: billId,
    amountReturn,
    rzpPaymentId,
    isUpiAmtPaid,
    staffId,
    storeId: storeData._id,
  };
  
  let isBillSaved, billBarcode, isDuplicate = false;
  
  if(!billId) return res.status(400).json({ msg: 'Bill Id slug is required'});

  try {
    const maxAttemptToSaveInDB = 1;
    setToBillsCache(billId, newBillData);
    logToDiscord(JSON.stringify({billId, newBillData}))
    const duplicateBill = await Bill.findOne({ slug: billId });
    if (duplicateBill) {
      isBillSaved = true;
      isDuplicate = true;
      return;
    }
    const billSaved = await saveBill(newBillData, billId,storeData, maxAttemptToSaveInDB);
    isBillSaved = billSaved.isBillSaved;
    billBarcode = billSaved.billBarcode;
    logToDiscord(JSON.stringify({billSaved}))
  } catch (error) {
    logToDiscord(JSON.stringify(error))
    console.log(error);
  } finally {
    if (isBillSaved) {
      deleteBillFromBillCacheById(billId);
      res.status(200).json({
        success: true,
        message: isDuplicate ? 'This bill already exist with same slug!' : 'Bill saved successfully!',
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
  storeData,
  maxAttemptToSaveInDB,
  currentAttempt = 0
) => {
  if (currentAttempt > maxAttemptToSaveInDB) {
    return { isBillSaved: false, billBarcode: '' };
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
        staffId,
      } = newBillData;
      const { collectionName } = storeData;
      const StoreInventoryModel = getStoreInventoryModel(collectionName);
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
              item = await StoreInventoryModel.findOne({ itemId: _id });
              if (item) {
                item.itemQuantityInStore -= orderQuantityInNumber; 
                await item.save();
              }
            } catch (error) {
              logToDiscord(JSON.stringify(error))
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
        staffId,
        storeId:storeData._id
      });
      return { isBillSaved: true, billBarcode: newBill._id };
    } catch (error) {
      return await saveBill(
        newBillData,
        billId,
        storeData,
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
    logToDiscord(JSON.stringify(error))
    return false;
  }
};

module.exports = saveOrCacheBill;
