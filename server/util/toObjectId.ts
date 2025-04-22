import mongoose, { Types } from 'mongoose';

/**
 * Safely converts a value to a MongoDB ObjectId.
 * @param value - The value to convert (string or any).
 * @returns A valid ObjectId or null if invalid.
 */
export const toObjectId = (value: unknown): Types.ObjectId | null => {
  if (typeof value !== 'string' || !mongoose.Types.ObjectId.isValid(value)) {
    return null;
  }
  return new mongoose.Types.ObjectId(value);
}
