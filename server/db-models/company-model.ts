import mongoose, { Schema } from 'mongoose';
import { CompanyType } from 'server/types';

const CompanySchema: Schema<CompanyType> = new Schema({
  companyName: { type: String, required: true, unique: true },
},
{
  timestamps: true
}
);

export const CompanyModel = mongoose.model<CompanyType>('Company', CompanySchema);