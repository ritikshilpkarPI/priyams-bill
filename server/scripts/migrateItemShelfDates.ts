
import mongoose from "mongoose";
import { Item } from "../db-models/item-model";
import PurchaseOrder from "../db-models/purchase-order-model";
import dotenv from "dotenv";
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
    const unsetResult = await Item.updateMany({}, { $unset: { itemShelfDate: 1 } });
    console.log(`Removed 'itemShelfDate' from ${unsetResult.modifiedCount} items`);


    const approvedOrders = await PurchaseOrder.find({ isApproved: true});

    let updates = [];

    for (const order of approvedOrders) {
      const { purchasedItems = [], _id: purchaseOrderId, approveTime } = order;

      for (const item of purchasedItems) {
        if (!item.item_id || !mongoose.Types.ObjectId.isValid(item.item_id)) continue;

        const expiryEntries = item.expiryDates || [];

        for (const entry of expiryEntries) {
          const { mfgDate, date: expiryDate, value: quantity } = entry;

          if (!mfgDate || !expiryDate || !quantity) continue;

          updates.push({
            updateOne: {
              filter: { _id: item.item_id },
              update: {
                $push: {
                  itemShelfDates: {
                    manufacturingDate: new Date(mfgDate),
                    expiryDate: new Date(expiryDate),
                    quantity,
                    purchaseOrderId,
                    entryDate: approveTime,
                  },
                },
              },
            },
          });
        }
      }
    }

    if (updates.length > 0) {
      const result = await Item.bulkWrite(updates);
      console.log("Migration complete:", result);
    } else {
      console.log("No itemShelfDates to insert.");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error(" Migration failed:", error);
    await mongoose.disconnect();
  }
};

migrateItemShelfDates();
