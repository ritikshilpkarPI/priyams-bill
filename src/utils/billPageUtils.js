import { roundNumber } from "./roundNumber";

export const calculateAmountReturn = (billTotal, payments) => {
    const totalPayment = (Number(payments.cashPay) || 0) + (Number(payments.upiPay) || 0);
    const returnAmount = totalPayment - billTotal;
    return roundNumber(returnAmount > 0 ? returnAmount : 0);
  };
  
  export const calculateMRPTotal = (items) => {
    return items.reduce((total, item) => {
      const itemMRP = Number(item.itemDetail.itemMRPperUnit) || 0;
      const quantity = Number(item.itemQuantityInBill) || 0;
      return total + (itemMRP * quantity);
    }, 0);
  };
  
  export const calculateAmountTotal = (items) => {
    return roundNumber(items.reduce((total, item) => {
      const price = Number(item.itemDetail.itemSellingPricePerUnit) || 0;
      const quantity = Number(item.itemQuantityInBill) || 0;
      return total + (price * quantity);
    }, 0));
  };
  
  export const calculateTotalItems = (items) => {
    return items.reduce((total, item) => {
      return total + (Number(item.itemQuantityInBill) || 0);
    }, 0);
  };
  
  export const calculateBillProfit = (items) => {
    return items.reduce((total, item) => {
      const mrp = Number(item.itemDetail.itemMRPperUnit) || 0;
      const price = Number(item.itemDetail.itemSellingPricePerUnit) || 0;
      const quantity = Number(item.itemQuantityInBill) || 0;
      const itemProfit = (mrp - price) * quantity;
      return total + (itemProfit > 0 ? itemProfit : 0);
    }, 0);
  };