export function getCheckedExpiredItems(resp: Record<string, any[]>) {
    const items: {
      itemId: string;
      expiryDate: Date;
      quantity: number;
      purchaseOrderId: string;
      costPricePerUnit: number;
      totalCostPrice: number;
    }[] = [];
    let expiryBatchCost = 0;
  
    for (const [itemId, batches] of Object.entries(resp)) {
      const checkedBatches = (batches as any[]).filter(b => b.checked);
      if (checkedBatches.length === 0) continue;
  
      checkedBatches.forEach(batch => {
        const {
          expiryDate,
          quantity,
          purchaseOrderId,
          costPrice = 0,
        } = batch;
        const totalCostPrice = costPrice * quantity;
        expiryBatchCost += totalCostPrice;
  
        items.push({
          itemId,
          expiryDate: new Date(expiryDate),
          quantity,
          purchaseOrderId,
          costPricePerUnit: costPrice,
          totalCostPrice,
        });
      });
    }
  
    return { items, expiryBatchCost };
  }