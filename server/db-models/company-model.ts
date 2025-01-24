import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema<CompanySchemaType>({
  name: { type: String },
});

export const Company = mongoose.model<CompanySchemaType>(
  'Company',
  CompanySchema
);
