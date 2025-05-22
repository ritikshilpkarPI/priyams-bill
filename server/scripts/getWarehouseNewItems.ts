import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import PurchaseOrderModel from '../db-models/purchase-order-model'; 

dotenv.config();

const { ENV_NAME, NODE_ENV, STAGING_DB, PROD_DB, DEV_DB } = process.env;

const mongoUriEnvMap: Record<string, string | undefined> = {
  staging: STAGING_DB,
//   production: PROD_DB,
//   dev: DEV_DB,
};

const envKey = ENV_NAME ?? NODE_ENV ?? 'dev';
const MONGODB_URI = mongoUriEnvMap[envKey];

if (!MONGODB_URI) {
  console.error(`❌ No MongoDB URI found for environment: ${envKey}`);
  process.exit(1);
}

const connectToDB = async () => {
  await mongoose.connect(MONGODB_URI);
  console.log(`✅ Connected to MongoDB [${envKey}]`);
};

interface PurchasedItem {
  barcode?: string;
  inputName?: string;
  sku?: string;
  stockQuantity?: number;
  minimumQuantity?: number;
  itemQuantity?: number;
  unit?: string;
  itemRemark?: string;
  sellingPrice?: number;
  mrp?: number;
  costPrice?: number;
  currentStock?: number;
  brand?: string;
  companyName?: string;
  category?: string;
  subCategory?: string;
  flavourOrFeature?: string;
  returnPolicyAvailable?: boolean;
  freeItemsAvailable?: boolean;
  saleTime?: string;
  itemHasExpiry?: boolean;
  newItem?: boolean;
}

interface PurchaseOrder {
  _id: any;
  approveTime?: Date;
  purchasedItems?: PurchasedItem[];
}

// CSV escape helper
const escapeCSVValue = (val: any): string => {
  if (val === null || val === undefined) return '';
  const str = String(val);
  return str.includes(',') || str.includes('"') || str.includes('\n')
    ? `"${str.replace(/"/g, '""')}"`
    : str;
};

// Main logic
const exportNewItemsToCSV = async () => {
  try {
    await connectToDB();

    const startDate = new Date('2025-02-24T00:00:00.000Z');

    const purchaseOrders = await PurchaseOrderModel.find({
      isApproved: true,
      approveTime: { $gt: startDate },
    }).lean() as PurchaseOrder[];

    const newItems = purchaseOrders.flatMap((order) =>
      (order.purchasedItems || [])
        .filter((item) => item.newItem === true)
        .map((item) => ({
          purchaseOrderId: order._id,
          approveTime: order.approveTime?.toISOString(),
          barcode: item.barcode,
          inputName: item.inputName,
          sku: item.sku,
          stockQuantity: item.stockQuantity,
          minimumQuantity: item.minimumQuantity,
          itemQuantity: item.itemQuantity,
          unit: item.unit,
          itemRemark: item.itemRemark,
          sellingPrice: item.sellingPrice,
          mrp: item.mrp,
          costPrice: item.costPrice,
          currentStock: item.currentStock,
          brand: item.brand,
          companyName: item.companyName,
          category: item.category,
          subCategory: item.subCategory,
          flavourOrFeature: item.flavourOrFeature,
          returnPolicyAvailable: item.returnPolicyAvailable,
          freeItemsAvailable: item.freeItemsAvailable,
          saleTime: item.saleTime,
          itemHasExpiry: item.itemHasExpiry,
          newItem: item.newItem,
        }))
    );

    if (newItems.length === 0) {
      console.log('⚠️ No new items found after March 24.');
      return;
    }

    const headers = Object.keys(newItems[0]);
    const csvRows = [
      headers.join(','), // Header row
      ...newItems.map((row) =>
        headers.map((key) => escapeCSVValue(row[key as keyof typeof row])).join(',')
      ),
    ];

    const csvContent = csvRows.join('\n');
    const filePath = `./new_items_after_march_24_${envKey}.csv`;
    fs.writeFileSync(filePath, csvContent);

    console.log(`✅ CSV generated: ${filePath}`);
  } catch (error) {
    console.error('❌ Error generating CSV:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

exportNewItemsToCSV();

