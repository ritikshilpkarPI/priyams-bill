import mongoose, { Document, Schema } from "mongoose";

export interface StoreType extends Document {
  storeAddress: {
    addressText: string;
    locality: string;
  };
  storePincode: string;
  storeContacts: string[];
  storeCode: string;
  storeNumber: number;
  storeCollectionName: string;
}

const StoreSchema: Schema<StoreType> = new Schema({
  storeAddress: {
    addressText: { type: String},
    locality: { type: String},
  },
  storePincode: { type: String},
  storeContacts: { type: [String]},
  storeNumber: { type: Number, unique: true },
  // storeCode will be generated as "PSTR_{storeNumber}_{storePincode}"
  storeCode: { type: String, unique: true },
  storeCollectionName: { type: String },
});

StoreSchema.pre<StoreType>("save", async function (next) {
  if (this.isNew) {
    if (!this.storeNumber) {
      const Model = this.constructor as mongoose.Model<StoreType>;
      const maxStore = await Model.findOne({}).sort({ storeNumber: -1 }).exec();
      this.storeNumber = maxStore ? maxStore.storeNumber + 1 : 1;
    }
    // Generate storeCode as: PSTR_{storeNumber}_{storePincode}
    this.storeCode = `PSTR_${this.storeNumber}_${this.storePincode}`;
    // Generate storeCollectionName as storeCode in lowercase
    this.storeCollectionName = this.storeCode.toLowerCase();
  }
  next();
});

export const StoreModel = mongoose.model<StoreType>("Store", StoreSchema);
