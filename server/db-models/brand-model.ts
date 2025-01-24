import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema<BrandSchemaType>({
  name: { type: String },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
});

export const Brand = mongoose.model<BrandSchemaType>('Brand', BrandSchema);
