import mongoose from 'mongoose';
import { StoreModel } from '../db-models/store-model';
import { Bill } from '../db-models/bill-model';
import { getStoreInventoryModel } from '../db-models/storeInventory-model';

export async function updateSellFrequencyForStore(storeId: string) {
  if (!storeId) throw new Error('storeId is required');
  const store = await StoreModel.findById(storeId);
  if (!store) throw new Error('Store not found');
  const StoreInventory = getStoreInventoryModel(store.collectionName);
  const inventoryItems = await StoreInventory.find({}).lean();

  const now = new Date();
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const sales = await Bill.aggregate([
    { $match: {
        storeId: new mongoose.Types.ObjectId(storeId),
        createdAt: { $gte: last30Days, $lte: now }
      }
    },
    { $unwind: '$items' },
    { $group: {
        _id: '$items.itemDetail',
        totalSold: { $sum: '$items.itemQuantityInBill' }
      }
    },
    { $group: {
      _id: null,
      kv: {
        $push: {
          k: { $toString: '$_id' },  
          v: '$totalSold'
        }
      }
    }
  },
  { $project: {
      _id: 0,
      sales: { $arrayToObject: '$kv' }
    }
  }
  ]);

  const salesMap = sales.length > 0 ? sales[0].sales : {};


  const bulkOps = inventoryItems.map(inv => {
    const itemId = inv.itemId.toString();
    const totalSold = salesMap[itemId] || 0;
    let sellFrequency = totalSold / 30;
    sellFrequency = Math.ceil(sellFrequency);
    return {
      updateOne: {
        filter: { _id: inv._id },
        update: { $set: { sellFrequency, minStockMultiplier: 2 } }
      }
    };
  });

  if (bulkOps.length) {
    await StoreInventory.bulkWrite(bulkOps);
  }

  return { updated: bulkOps.length, message: `sellFrequency updated for ${bulkOps.length} items.` };
} 