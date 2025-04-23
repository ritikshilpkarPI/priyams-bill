import mongoose, { Document, Schema } from 'mongoose';
import { StockTransactionType } from '../types';
import { generateRandomKey } from '../../src/utils/generateRandomKey';

const StockTransactionSchema = new Schema<StockTransactionType>(
  {
    transactionType: {
      type: String,
      required: true,
    },
    source: {
      sourceStaff: {
        type: Schema.Types.ObjectId,
        ref: 'staff',
      },
      sourceEntityId: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: false
      },
      sourceType: { type: String },
      sourceRemark: {
        type: String,
      },
    },
    destination: {
      destinationStaff: {
        type: Schema.Types.ObjectId,
        ref: 'staff',
      },
      destinationEntityId: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
      },
      destinationType: { type: String },
      destinationRemark: {
        type: String,
      },
    },
    transactionReason: {
      type: String,
    },
    dateOfTransaction: {
      type: Date,
      default: Date.now,
    },
    transactionStatus: {
      type: String,
      default: 'pending',
    },
    hasErrors: {
      type: Boolean,
      default: false,
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
    adminRemark: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    transactionItems: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Item',
        },
        itemByDate: [
          {
            sourceQuantity: {
              expiryDate: { type: Date },
              manufacturingDate: { type: Date },
              qty: { type: Number },
            },
            destinationQuantity: {
              expiryDate: { type: Date },
              manufacturingDate: { type: Date },
              qty: { type: Number },
            },
            destinationRemark: { type: String },
            sourceRemark: { type: String },
            itemError: {
                errorReason: {
                    type: String,
                    default: 'NONE',
                  },
                  errorQty: {
                    type: Number,
                  },
                  isResolved: {
                    type: Boolean,
                    default: false,
                  },
            },
          },
        ],
      },
    ],
    transactionSlug: {
      type: String,
      unique: true,
      default: function () {
        return `${Date.now()}${generateRandomKey(4)}`;
      },
    },
  },
  
  { timestamps: true }
);

export const StockTransactionModel = mongoose.model<StockTransactionType>(
  'StockTransaction',
  StockTransactionSchema
);
