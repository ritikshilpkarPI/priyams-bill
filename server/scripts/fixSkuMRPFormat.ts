import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { Item } from '../db-models/item-model'; 

const { ENV_NAME, NODE_ENV, STAGING_DB, PROD_DB, DEV_DB } = process.env;

const mongoUriEnvMap: Record<string, string | undefined> = {
  staging: STAGING_DB,
  production: PROD_DB,
  dev: DEV_DB,
};

const envKey = ENV_NAME ?? NODE_ENV ?? 'dev';
const MONGODB_URI = mongoUriEnvMap[envKey];

if (!MONGODB_URI) {
  console.error(`No MongoDB URI found for environment: ${envKey}`);
  process.exit(1);
}

const connectToDB = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log(' Connected to MongoDB');
};

const fixSkuMRPFormat = async () => {
    try {
      await connectToDB();
  
      const itemsToFix = await Item.find({
        sku: { $regex: /MRP\s*-\s*\d+/i }
      });
  
      console.log(` Found ${itemsToFix.length} items with invalid SKU format`);
      let updatedCount = 0;
      for (const item of itemsToFix) {
        const originalSku = item.sku;
        const updatedSku = originalSku.replace(/MRP\s*-\s*/i, 'MRP ');
  
        const result=await Item.updateOne(
          { _id: item._id },
          { $set: { sku: updatedSku } }
        );
        if (result.modifiedCount > 0) {
            updatedCount++;
            console.log(` Updated SKU: "${originalSku}" → "${updatedSku}" (ID: ${item._id})`);
          }
      }
      console.log(` Done! ${updatedCount} item(s) were successfully updated.`);

  
    } catch (error) {
      console.error(' Error while fixing SKUs:', error);
    } finally {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
  };
  

fixSkuMRPFormat();
