  type TransactionItem = {
    itemId: string;
    itemByDate: {
      sourceQuantity: {
        expiryDate: string;
        manufacturingDate: string;
        qty: number;
      };
      destinationQuantity: {
        expiryDate: string;
        manufacturingDate: string;
        qty: number;
      };
      destinationRemark: string;
      sourceRemark: string;
      itemError: {
        errorReason: string;
        errorQty: number;
        isResolved: boolean;
      };
    }[];
  };
  
  export const convertItemsToTransactionItems = (
    expiryBatchData: any[]
  ): TransactionItem[] => {
    const transactionItemsMap: Record<string, TransactionItem> = {};
  
    expiryBatchData.forEach((batch) => {
      const itemId = batch?.itemId?._id;
      const expiryDate = batch?.expiryDate;
      const manufacturingDate = batch?.manufacturingDate;
  
      if (!itemId || !expiryDate || !manufacturingDate) return;
  
      const itemByDateEntry = {
        sourceQuantity: {
          expiryDate,
          manufacturingDate,
          qty: batch?.quantity || 0,
        },
        destinationQuantity: {
          expiryDate,
          manufacturingDate,
          qty: 0,
        },
        destinationRemark: '',
        sourceRemark: '',
        itemError: {
          errorReason: 'NONE',
          errorQty: 0,
          isResolved: true,
        },
      };
  
      if (transactionItemsMap[itemId]) {
        transactionItemsMap[itemId].itemByDate.push(itemByDateEntry);
      } else {
        transactionItemsMap[itemId] = {
          itemId,
          itemByDate: [itemByDateEntry],
        };
      }
    });
  
    const transactionItems = Object.values(transactionItemsMap);
    return transactionItems;
  };
  