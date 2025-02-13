import { useDispatch, useSelector } from 'react-redux';
import { updateBillItems, updateCustomerInfo, updatePayment, resetBillState } from 'src/redux/bill/billSlice'; 
import { calculateAmountReturn, calculateAmountTotal, calculateBillProfit, calculateMRPTotal, calculateTotalItems } from "../utils/billPageUtils";
import { selectBill } from 'src/redux/bill/billSelectors';

export const useBillState = () => {
  const dispatch = useDispatch();
  const billState = useSelector(selectBill);

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

  const updateBillItemsData = (items) => {
    const mergedItemsList = mergeDuplicateItemsInBill(items);
    dispatch(updateBillItems(mergedItemsList));

    dispatch(updateCustomerInfo({
      field: 'billMRPTotal',
      value: calculateMRPTotal(mergedItemsList).toString()
    }));
    dispatch(updateCustomerInfo({
      field: 'billAmountTotal',
      value: calculateAmountTotal(mergedItemsList).toString()
    }));
    const billAmountTotal = calculateAmountTotal(mergedItemsList).toString();
    const amountReturn = calculateAmountReturn(Number(billAmountTotal), billState).toString();
    dispatch(updateCustomerInfo({ field: 'amountReturn', value: amountReturn }));
    dispatch(updateCustomerInfo({
      field: 'totalNumberOfItems',
      value: calculateTotalItems(mergedItemsList).toString()
    }));
    dispatch(updateCustomerInfo({
      field: 'totalNumberOfUniqueItems',
      value: mergedItemsList.length.toString()
    }));
    dispatch(updateCustomerInfo({
      field: 'totalBillProfit',
      value: calculateBillProfit(mergedItemsList).toString()
    }));
  };

  const updateCustomerInfoField = (field, value) => {
    dispatch(updateCustomerInfo({ field, value }));
  };

  const updatePaymentAmount= (type, amount) => {
    const numAmount = Number(amount) || 0;
    dispatch(updatePayment({ type, amount: numAmount }));
    dispatch(updateCustomerInfo({
      field: 'amountReturn',
      value: calculateAmountReturn(billState.billAmountTotal, {
        ...billState,
        [type]: numAmount
      }).toString()
    }));
  };

  const resetBillStateData = () => {
    dispatch(resetBillState());
  };

  return {
    billState,
    updateBillItems:updateBillItemsData,
    updateCustomerInfo:updateCustomerInfoField,
    updatePayment:updatePaymentAmount,
    resetBillState:resetBillStateData
  };
};