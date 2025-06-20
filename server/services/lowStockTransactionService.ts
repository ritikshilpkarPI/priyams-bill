import { StoreModel } from '../db-models/store-model';
import { getStoreInventoryModel } from '../db-models/storeInventory-model';
import { createWarehouseToStoreDeficiencyTransaction } from '../util/createWarehouseToStoreDeficiencyTransaction';

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

  let minStockMultiplier = (store as any).minStockMultiplier;
  if (typeof minStockMultiplier !== 'number' || minStockMultiplier <= 0) {
    minStockMultiplier = 1.5;
  }

  const lowStockItems = inventoryItems.filter(item => {
    const sellFrequency = Number((item as any).sellFrequency) || 0;
    const qty = Number((item as any).itemQuantityInStore) || 0;
    return sellFrequency > 0 && qty < minStockMultiplier * sellFrequency;
  });

  const deficiencyItems = lowStockItems.map((item: any) => ({
    itemId: item.itemId.toString(),
    deficiencyQty: Math.ceil(minStockMultiplier * Number(item.sellFrequency)) - Number(item.itemQuantityInStore),
  }));

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
    message: `${lowStockItems.length} items have less than ${minStockMultiplier}x sellFrequency in stock. ${transactions.length ? transactions.length + ' transaction(s) created.' : 'No transaction created.'}`,
  };
}