import mongoose from 'mongoose';
import { Item } from '../db-models/item-model';
import PurchaseOrder from '../db-models/purchase-order-model';
import dotenv from 'dotenv';
dotenv.config();
const { ENV_NAME, NODE_ENV, STAGING_DB, PROD_DB, DEV_DB } = process.env;

const mongoUriEnvMap: Record<string, string | undefined> = {
  staging: STAGING_DB,
  production: PROD_DB,
  dev: DEV_DB,
};

const envKey = ENV_NAME ?? NODE_ENV ?? 'dev';
const MONGODB_URI = mongoUriEnvMap[envKey];

if (!MONGODB_URI) {
  console.error(`Error: No MongoDB URI found for environment: ${envKey}`);
  process.exit(1);
}

const connectToDB = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
};

const migrateItemShelfDates = async () => {
  try {
    await connectToDB();

    const unsetResult = await Item.updateMany(
      {},
      { $unset: { itemShelfDates: 1 } }
    );
    console.log(
      `Removed 'itemShelfDates' from ${unsetResult.modifiedCount} items`
    );

    const shelfEntries = await PurchaseOrder.aggregate([
      { $match: { isApproved: true } },
      { $unwind: '$purchasedItems' },
      {
        $match: {
          'purchasedItems.expiryDates': { $exists: true, $ne: [] },
        },
      },
      { $unwind: '$purchasedItems.expiryDates' },

      {
        $project: {
          item_id: '$purchasedItems.item_id',
          shelfDate: {
            manufacturingDate: {
              $toDate: '$purchasedItems.expiryDates.mfgDate',
            },
            expiryDate: {
              $toDate: '$purchasedItems.expiryDates.date',
            },
            quantity: '$purchasedItems.expiryDates.value',
            purchaseOrderId: '$_id',
            entryDate: '$approveTime',
          },
        },
      },
    ]);

    const updates = shelfEntries
      .filter((doc) => mongoose.Types.ObjectId.isValid(doc.item_id))
      .map((doc) => ({
        updateOne: {
          filter: { _id: new mongoose.Types.ObjectId(doc.item_id) },
          update: {
            $push: {
              itemShelfDates: {
                ...doc.shelfDate,
                _id: new mongoose.Types.ObjectId(),
              },
            },
          },
        },
      }));


    if (updates.length > 0) {
      const result = await Item.bulkWrite(updates);
      console.log('Migration complete:', result);
    } else {
      console.log('No itemShelfDates to insert.');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Migration failed:', error);
    await mongoose.disconnect();
  }
};

migrateItemShelfDates();
