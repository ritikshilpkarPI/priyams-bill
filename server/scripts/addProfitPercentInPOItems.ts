import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const FILE_PATH = 'updated_docs.json';
const {
    ENV_NAME = "",
    NODE_ENV = "",
    STAGING_DB = "",
    PROD_DB = "",
    DEV_DB = "",
  } = process.env;

const mongoUriEnvMap: { [key: string]: string } = {
    staging: STAGING_DB,
    production: PROD_DB,
    dev: DEV_DB,
};

const MONGODB_URI = mongoUriEnvMap[ENV_NAME] || mongoUriEnvMap[NODE_ENV] || "";
// Define the PurchaseOrder schema (only relevant fields for update)
const purchaseOrderSchema = new mongoose.Schema({
  purchasedItems: [
    {
      profitPercentage: Number,
      sellingPrice: Number,
      costPrice: Number,
    },
  ],
});

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

const saveUpdatedIdsToFile = (updatedIds: string[]) => {
    try {
      let existingIds: string[] = [];
  
      if (fs.existsSync(FILE_PATH)) {
        const fileData = fs.readFileSync(FILE_PATH, 'utf8');
        existingIds = JSON.parse(fileData);
      }
  
      const updatedList = [...new Set([...existingIds, ...updatedIds])]; // Remove duplicates
      fs.writeFileSync(FILE_PATH, JSON.stringify(updatedList, null, 2));
  
      console.log(`Successfully wrote ${updatedIds.length} updated IDs to ${FILE_PATH}`);
    } catch (error) {
      console.error('Error writing to file:', error);
    }
  };

const addProfitPercentInPOItems = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const BATCH_SIZE = 10;
    let updatedCount = 0;
    
    while (true) {
      const orders = await PurchaseOrder.find({
        'purchasedItems.profitPercentage': { $exists: false },
        purchasedItems: {
          $exists: true,
          $ne: [],
          $elemMatch: {
            sellingPrice: { $exists: true, $ne: null },
            costPrice: { $exists: true, $ne: null },
          },
        },
      }).limit(BATCH_SIZE);
      

      if (orders.length === 0) break; // No more documents to update
      const updatedIds: string[] = [];

      const bulkOps = orders.map((order) => {
        const updatedPurchasedItems = order.purchasedItems.map((item: any) => {
          if (typeof item?.profitPercentage === 'undefined' && item?.sellingPrice !== undefined && item?.costPrice !== undefined) {
            const costPrice = Number(item.costPrice);
            const sellingPrice = Number(item.sellingPrice);

            // Avoid division by zero and ensure valid values
            if (costPrice > 0) {
              item.profitPercentage = Number((((sellingPrice - costPrice) / costPrice) * 100).toFixed(2));
            } else {
              item.profitPercentage = 0; // Default to 0% profit if costPrice is 0 or invalid
            }
          }
          return item;
        });
        updatedIds.push(order._id.toString());
        return {
          updateOne: {
            filter: { _id: order._id },
            update: { $set: { purchasedItems: updatedPurchasedItems } },
          },
        };
      });

      if (bulkOps.length > 0) {
        await PurchaseOrder.bulkWrite(bulkOps);
        updatedCount += bulkOps.length;
        saveUpdatedIdsToFile(updatedIds);
        console.log(`Updated ${updatedCount} documents so far...`);
      }
    }

    console.log(`Update completed. Total updated documents: ${updatedCount}`);
  } catch (error) {
    console.error('Error updating documents:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit();
  }
};

addProfitPercentInPOItems();