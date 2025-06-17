import mongoose, { Document, Schema } from 'mongoose';

export type ImageType = 
  | 'barcode'
  | 'itemName'
  | 'packetQty'
  | 'unit'
  | 'mrp'
  | 'costPrice'
  | 'sellingPrice'
  | 'stockQuantity'
  | 'expiry'
  | 'bill'
  | 'payment'
  | 'other';

export interface IImage extends Document {
  public_id: string;
  secure_url: string;
  type: ImageType;
  metadata: Map<string, any>;
  createdAt: Date;
  expiryIndex?: number;
  purchasedItemIndex?: number;
}

const imageSchema = new Schema<IImage>({
  public_id: {
    type: String,
    required: true
  },
  secure_url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
    default: new Map()
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiryIndex: {
    type: Number,
    required: false
  },
  purchasedItemIndex: {
    type: Number,
    required: false
  }
});

imageSchema.index({ expiryIndex: 1, purchasedItemIndex: 1 });

export const Image = mongoose.model<IImage>('Image', imageSchema); 