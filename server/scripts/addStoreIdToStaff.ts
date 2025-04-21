import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Staff from '../db-models/staff-model'; 

const { ENV_NAME, NODE_ENV, STAGING_DB, PROD_DB, DEV_DB } = process.env;

const mongoUriEnvMap: Record<string, string | undefined> = {
  staging: STAGING_DB,
  production: PROD_DB,
  dev: DEV_DB,
};

const envKey = ENV_NAME ?? NODE_ENV ?? 'dev';
const MONGODB_URI = mongoUriEnvMap[envKey];

if (!MONGODB_URI) {
  console.error(` No MongoDB URI found for environment: ${envKey}`);
  process.exit(1);
}

const connectToDB = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log(' Connected to MongoDB');
};

const storeIdToAssign = '67e3dd6df2a92b27bbf4b464';

const addStoreIdToStaff = async () => {
  try {
    await connectToDB();

    const staffsToUpdate = await Staff.find({ storeId: { $exists: false } });

    console.log(` Found ${staffsToUpdate.length} staff(s) without storeId`);
    let updatedCount = 0;

    for (const staff of staffsToUpdate) {
      const result = await Staff.updateOne(
        { _id: staff._id },
        { $set: { storeId: storeIdToAssign } }
      );

      if (result.modifiedCount > 0) {
        updatedCount++;
        console.log(` Updated staff "${staff.name}" with storeId (ID: ${staff._id})`);
      }
    }

    console.log(` Done! ${updatedCount} staff record(s) successfully updated.`);
  } catch (error) {
    console.error(' Error while updating staff records:', error);
  } finally {
    await mongoose.disconnect();
    console.log(' Disconnected from MongoDB');
  }
};

addStoreIdToStaff();
