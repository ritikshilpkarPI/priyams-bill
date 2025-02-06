import { useEffect, useState } from "react";
import { calculateAmountReturn, calculateAmountTotal, calculateBillProfit, calculateMRPTotal, calculateTotalItems } from "../utils/billPageUtils";
import { v4 as uuidv4 } from 'uuid'

export const INITIAL_BILL_STATE = {
    billItems: [],
    customerName: '',
    customerPhone: '',
    billMRPTotal: 0,
    billAmountTotal: 0,
    billDiscountTotal: 0,
    totalNumberOfItems: 0,
    totalNumberOfUniqueItems: 0,
    totalBillProfit: 0,
    cashPay: 0,
    upiPay: 0,
    amountReturn: 0,
    billId: ''
  };

export const useBillState = () => {
    const [billState, setBillState] = useState(INITIAL_BILL_STATE);
    useEffect(() => {
      // Initialize billId when component mounts
      setBillState(prev => ({
        ...prev,
        billId: `${uuidv4()}-${Date.now()}`
      }));
    }, []);
  
    const mergeDuplicateItemsInBill = (itemsList) => {
      const itemMap = {};
      itemsList.forEach((item) => {
        const key = `${item.itemDetail._id}-${item.itemDetail.itemName}`;
        if (itemMap[key]) {
          itemMap[key].itemQuantityInBill += item.itemQuantityInBill;
        } else {
          itemMap[key] = { ...item };
        }
      });
      const mergedItems = Array.from(Object.values(itemMap));
      return mergedItems;
    };
  
    const updateBillItems = (items) => {
      const mergedItemsList = mergeDuplicateItemsInBill(items)
      setBillState(prev => {
        return ({
          ...prev,
          billItems: mergedItemsList,
          billMRPTotal: calculateMRPTotal(mergedItemsList),
          billAmountTotal: calculateAmountTotal(mergedItemsList),
          totalNumberOfItems: calculateTotalItems(mergedItemsList),
          totalNumberOfUniqueItems: mergedItemsList.length,
          totalBillProfit: calculateBillProfit(mergedItemsList)
        })
      });
    };
  
    const updateCustomerInfo = (field, value) => {
      setBillState(prev => ({
        ...prev,
        [field]: value
      }));
    };
  
    const updatePayment = (type, amount) => {
      const numAmount = Number(amount) || 0;
      setBillState(prev => ({
        ...prev,
        [type]: numAmount,
        amountReturn: calculateAmountReturn(prev.billAmountTotal, {
          ...prev,
          [type]: numAmount
        })
      }));
    };
  
    const resetBillState = () => {
      setBillState({
        ...INITIAL_BILL_STATE,
        billId: `${uuidv4()}-${Date.now()}`
      });
    };
  
    return {
      billState,
      updateBillItems,
      updateCustomerInfo,
      updatePayment,
      resetBillState
    };
  };