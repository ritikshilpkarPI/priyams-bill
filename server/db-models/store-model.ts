import mongoose, { Document, Schema } from "mongoose";

export interface StoreType extends Document {
  address: {
    addressText: string;
    locality: string;
  };
  pincode: string;
  contacts: string[];
  code: string;
  number: number;
  collectionName: string;
  name: string;
  type: "STORE" | "WAREHOUSE";
}
const StoreSchema: Schema<StoreType> = new Schema({
  address: {
    addressText: { type: String},
    locality: { type: String},
  },
  pincode: { type: String},
  contacts: { type: [String]},
  number: { type: Number, unique: true },
  // code will be generated as "pstr_{storeNumber}_{storePincode}"
  code: { type: String, unique: true },
  collectionName: { type: String },
  // name will be generated as address.locality_number
  name: { type: String },
  // define a fields which will be used to identify it's a store or warehouse use enum
  type: { type: String, enum: ["STORE", "WAREHOUSE"], default: "STORE" },
});

StoreSchema.pre<StoreType>("save", async function (next) {
  if (this.isNew) {
    if (!this.number) {
      const Model = this.constructor as mongoose.Model<StoreType>;
      const maxStore = await Model.findOne({}).sort({ storeNumber: -1 }).exec();
      this.number = maxStore ? maxStore.number + 1 : 1;
    }
    // Generate storeCode as: pstr_{storeNumber}_{storePincode}
    this.code = `pstr_${this.number}_${this.pincode}`;
    // Generate storeCollectionName as storeCode in lowercase
    this.collectionName = this.code.toLowerCase();
    this.name = `${this.address.locality}_${this.number}`
  }
  next();
});

export const StoreModel = mongoose.model<StoreType>("Store", StoreSchema);
