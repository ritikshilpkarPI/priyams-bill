import mongoose, { Schema, Types } from 'mongoose';
import { DealerType } from 'server/types';

const DealerSchema: Schema<DealerType> = new Schema({
  dealerName: { type: String },
  dealerBrands: [{ type: Types.ObjectId, ref: 'Brand' }],
  dealerCompanies: [{ type: Types.ObjectId, ref: 'Company' }],
  dealerNumber: { type: Number }
});

export const DealerModel = mongoose.model<DealerType>('Dealer', DealerSchema);
