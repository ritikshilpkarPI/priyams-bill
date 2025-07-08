import { StoreModel } from '../db-models/store-model';
import { getStoreInventoryModel } from '../db-models/storeInventory-model';
import { createWarehouseToStoreDeficiencyTransaction } from '../util/createWarehouseToStoreDeficiencyTransaction';
import { StockTransactionModel } from '../db-models/stock-transaction-model';
import { CONSTANTS } from '../constants/constants';


export async function handleLowStockAndCreateTransactions({
  storeId,
  staffId,
}: {
  storeId: string;
  staffId: string;
}) {
  const store = await StoreModel.findById(storeId);
  if (!store) throw new Error('Store not found');
  const StoreInventory = getStoreInventoryModel(store.collectionName);
  const inventoryItems = await StoreInventory.find({}).lean();

  const lowStockItems = inventoryItems.filter(item => {
    const sellFrequency = Number((item as any).sellFrequency) || 0;
    let qty = Number((item as any).itemQuantityInStore) || 0;
    if (qty < 0) qty = 0;
    
    let minStockMultiplier = (item as any).minStockMultiplier;
    if (typeof minStockMultiplier !== 'number' || minStockMultiplier <= 0) {
      minStockMultiplier = 2;
    }
    
    return sellFrequency > 0 && qty < minStockMultiplier * sellFrequency;
  });

  const deficiencyItems = lowStockItems.map((item: any) => {
    let minStockMultiplier = (item as any).minStockMultiplier;
    if (typeof minStockMultiplier !== 'number' || minStockMultiplier <= 0) {
      minStockMultiplier = 2;
    }
    
    let qty = Number((item as any).itemQuantityInStore) || 0;
    if (qty < 0) qty = 0;
    
    return {
      itemId: item.itemId.toString(),
      deficiencyQty: Math.ceil(minStockMultiplier * Number(item.sellFrequency)) - qty,
    };
  });

  const existingTransaction = await StockTransactionModel.findOne({
    transactionReason: CONSTANTS.AUTO_STORE_STOCK_TRANSACTION,
  });
  

  if (existingTransaction) {
    const existingItemIds = new Set(
      (existingTransaction.transactionItems || []).map((item: any) => item.itemId.toString())
    );
    const missingItems = deficiencyItems.filter(
      (item) => !existingItemIds.has(item.itemId)
    );
    if (missingItems.length === 0) {
      return {
        lowStockItems,
        transactions: [existingTransaction],
        message: `All low stock items are already present in the existing transaction. Transaction ID: ${existingTransaction._id}`,
        transactionId: existingTransaction._id,
      };
    } else {
      const newTransactionItems = missingItems.map((item) => ({
        itemId: item.itemId.toString(),
        itemByDate: [
          {
            sourceQuantity: {
              expiryDate: null,
              manufacturingDate: null,
              qty: 0,
            },
            destinationQuantity: {
              expiryDate: null,
              manufacturingDate: null,
              qty: item.deficiencyQty,
            },
            destinationRemark: '',
            sourceRemark: '',
            itemError: {
              errorReason: 'NONE',
              errorQty: 0,
              isResolved: true,
            },
          },
        ],
      }));
      existingTransaction.transactionItems.push(...newTransactionItems);
      await existingTransaction.save();
      return {
        lowStockItems,
        transactions: [existingTransaction],
        message: `Added ${missingItems.length} missing items to the existing transaction. Transaction ID: ${existingTransaction.transactionSlug}`,
        transactionId: existingTransaction.transactionSlug,
      };
    }
  }

  let transactions = [];
  if (deficiencyItems.length > 0 && staffId) {
    for (let i = 0; i < deficiencyItems.length; i += 50) {
      const chunk = deficiencyItems.slice(i, i + 50);
      const transaction = await createWarehouseToStoreDeficiencyTransaction({
        storeId,
        staffId,
        items: chunk,
      });
      transactions.push(transaction);
    }
  }

  return {
    lowStockItems,
    transactions,
    message: `${lowStockItems.length} items have less than their minStockMultiplier x sellFrequency in stock. ${transactions.length ? transactions.length + ' transaction(s) created.' : 'No transaction created.'}`,
    transactionId: transactions.length ? transactions[0]._id : undefined,
  };
}