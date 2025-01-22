import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema<CategorySchemaType>({
  name: { type: String },
});

export const Category = mongoose.model<CategorySchemaType>(
  'Category',
  CategorySchema
);
