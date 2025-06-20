import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { StoreModel } from '../db-models/store-model';
import { Bill } from '../db-models/bill-model';
import { getStoreInventoryModel } from '../db-models/storeInventory-model';

export const updateSellFrequency = async (req: Request, res: Response) => {
  try {
    const { storeId } = req.body;
    if (!storeId) {
      return res.status(400).json({ success: false, message: 'storeId is required' });
    }

    const store = await StoreModel.findById(storeId);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

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
      }
    ]);

    const salesMap = sales.reduce<Record<string, number>>((acc, { _id, totalSold }) => {
      acc[_id.toString()] = totalSold;
      return acc;
    }, {});

    const bulkOps = inventoryItems.map(inv => {
      const tid = inv.itemId.toString();
      const totalSold = salesMap[tid] || 0;
      let sellFrequency = totalSold / 30;
      sellFrequency = Math.ceil(sellFrequency);
      
      return {
        updateOne: {
          filter: { _id: inv._id },
          update: { $set: { sellFrequency } }
        }
      };
    });

    if (bulkOps.length) {
      await StoreInventory.bulkWrite(bulkOps);
    }

    return res
      .status(200)
      .json({ success: true, message: `sellFrequency updated for ${bulkOps.length} items.` });

  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: 'Error updating sellFrequency', error: err.message });
  }
};
