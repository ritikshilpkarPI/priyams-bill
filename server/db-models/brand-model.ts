import mongoose, { Schema, Types } from 'mongoose';
import { BrandType } from 'server/types';

const BrandSchema: Schema<BrandType> = new Schema({
  brandName: { type: String },
  companyId: { type: Types.ObjectId, ref: 'Company'}
});

export const BrandModel = mongoose.model<BrandType>('Brand', BrandSchema);
