export const  shouldEnablePayment = (totalBillAmount: number, refundAmount: number) => {
    
    if (refundAmount >= totalBillAmount) {
      
        return true; 
    } else {
       
        return false; 
    }
}