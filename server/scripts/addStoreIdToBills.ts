import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import { Bill } from '../db-models/bill-model';

const { ENV_NAME, NODE_ENV, STAGING_DB, PROD_DB, DEV_DB } = process.env;
const STORE_ID="67e3dd6df2a92b27bbf4b464"

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
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
};

async function addStoreIdToBills() {
  try {
    await connectToDB();
    if (!STORE_ID) {
      throw new Error('STORE_ID is not defined in environment variables');
    }

    const storeObjectId = new mongoose.Types.ObjectId(STORE_ID);


    const result = await Bill.updateMany(
      { storeId: { $exists: false } }, 
      { $set: { storeId: storeObjectId } }
    );

    console.log(`Updated ${result.modifiedCount} bills successfully.`);
  } catch (error) {
    console.error('Error updating bills:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addStoreIdToBills();
