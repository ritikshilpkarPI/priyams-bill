import mongoose, { Schema } from "mongoose";
import { StoreInventoryItemType } from "server/types";

export type ChangeType = "ADD" | "REMOVE";
export type ChangedFrom = "WAREHOUSE" | "RETURN-EXC";


const StockChangeHistorySchema: Schema = new Schema({
  quantity: { type: Number},
  dateTime: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User", },
  changeType: { type: String, enum: ["ADD", "REMOVE"] },
  changedFrom: { type: String, enum: ["WAREHOUSE", "RETURN-EXC"] },
  transactionId: { type: Schema.Types.ObjectId },
});

const StoreInventoryItemSchema: Schema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: "Item"},
  itemQuantityInStore: { type: Number, default: 0 },
  itemStockChangeHistory: { type: [StockChangeHistorySchema], default: [] },
  itemShelfDates: {
    manufacturingDate: { type: Date },
    expiryDate: { type: Date },
    currentStockQuantity: { type: Number, default: 0 },
    initialStockQuantity: { type: Number, default: 0 },
  },
});

/**
 * Returns a Mongoose model for a store inventory collection.
 * Since each store has its own collection (named via storeCollectionName),
 * this helper uses a dynamic model name.
 *
 * @param collectionName - The name of the collection (typically storeCode.toLowerCase())
 */
export const getStoreInventoryModel = (collectionName: string) => {
  const modelName = `pstr_${collectionName}`;
  // Return the model if already registered, otherwise create a new one.
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName] as mongoose.Model<StoreInventoryItemType>;
  }
  return mongoose.model<StoreInventoryItemType>(modelName, StoreInventoryItemSchema, collectionName);
};
