/** RUN SCRIPT: npx ts-node server/scripts/addItemsToStoreInventory.ts */
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { ItemSchema } from "../db-models/item-model";
import { StoreModel } from "../db-models/store-model";
import { getStoreInventoryModel } from "../db-models/storeInventory-model";

const { ENV_NAME, NODE_ENV, STAGING_DB, PROD_DB, DEV_DB } = process.env;

const mongoUriEnvMap: Record<string, string | undefined> = {
  staging: STAGING_DB,
  production: PROD_DB,
  dev: DEV_DB,
};

const envKey = ENV_NAME ?? NODE_ENV ?? "dev"; 
const MONGODB_URI = mongoUriEnvMap[envKey];

if (!MONGODB_URI) {
  console.error(`Error: No MongoDB URI found for environment: ${envKey}`);
  process.exit(1);
}

const COLLECTION_NAME = "store_items_1_462022"; 

const connectToDB = async () => {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");
};

const addItemsToStoreInventory = async () => {
  try {
    await connectToDB();

    const Item = mongoose.model("Item", ItemSchema);
    const allItems = await Item.find({}, { _id: 1 });

    if (allItems.length === 0) {
      console.log("No items found in the database.");
      return;
    }

    const store = await StoreModel.findOne({ collectionName: COLLECTION_NAME });

    if (!store?.collectionName) {
      console.error(`Error: No store found or missing collectionName: ${COLLECTION_NAME}`);
      return;
    }

    const StoreInventoryModel = getStoreInventoryModel(store.collectionName);
    const inventoryItems = allItems.map((item) => ({
      itemId: item._id,
      itemQuantityInStore: 0,
      itemStockChangeHistory: [
        {
          quantity: 0,
          dateTime: new Date(),
          changeType: "ADD",
          changedFrom: "INITIAL-SETUP-SCRIPT",
        },
      ],
    }));

    await StoreInventoryModel.insertMany(inventoryItems);

    console.log("Inventory setup completed successfully.");
  } catch (error) {
    console.error("Error initializing store inventories:", error);
  } finally {
    await mongoose.connection.close();
  }
};

addItemsToStoreInventory();
