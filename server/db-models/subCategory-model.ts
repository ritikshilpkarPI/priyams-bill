import mongoose from 'mongoose';

const SubCategorySchema = new mongoose.Schema<SubCategorySchemaType>({
  name: { type: String },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
});

export const SubCategory = mongoose.model<SubCategorySchemaType>(
  'SubCategory',
  SubCategorySchema
);
