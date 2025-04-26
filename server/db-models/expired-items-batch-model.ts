import mongoose, { Schema } from 'mongoose';
import { ExpiredItemsSchema } from '../types';
import { expiredStatus } from '../util/constants/expiredItemsConstant';

const expiredItemsBatchSchema = new Schema<ExpiredItemsSchema>(
  {
    boxId: {
      type: String,
      unique: true
    },
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer' },
    stockTransactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'StockTransaction' },
    expiryImages: [
      {
        publicId: {
          type: String,
        },
        secureUrl: {
          type: String,
        },
      },
    ],
    expiryBatchCost: { type: Number },
    status: {
      type: String,
      default: expiredStatus.SAVED
    },
    statusHistory: [
      {
        status: { type: String },
        staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'staff' },
        dateTime: { type: Date },
        browser: { type: String },
        os: { type: String },
        ipReferrer: { type: String },
        statusChangeRemark: { type: String },
      },
    ],
    clearanceDetails: {
      clearanceReason: {
        type: String,
      },
      clearedOn: { type: Date },
      clearancePurchaseOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PurchaseOrder',
      },
      dealerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dealer',
      },
      clearanceRemark: { type: String },
    },
    isCleared: { type: Boolean },
    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        expiryDate: { type: Date },
        quantity: { type: Number },
        purchaseOrderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'PurchaseOrder',
        },
        costPricePerUnit: { type: Number },
        totalCostPrice: { type: Number },
      },
    ],
    itemWiseTotalCost: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
        itemTotalCost: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ExpiredItemsSchema>(
  'ExpiredItemsBatch',
  expiredItemsBatchSchema
);
