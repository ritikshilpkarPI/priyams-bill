import mongoose, { Document, Schema } from "mongoose";

export interface TransactionItemByDate {
  sourceQuantity: {
    expDt: Date;
    qty: number;
  };
  destinationQuantity: {
    expDt: Date;
    qty: number;
  };
  destinationRemark?: string;
  sourceRemark?: string;
  error?: {
    errorReason: string;
    errorQty?: number;
  };
}

export interface TransactionItem {
  itemId: mongoose.Types.ObjectId;
  itemByDate: TransactionItemByDate[];
}

export interface StockTransactionType extends Document {
  transactionType: string;
  source: {
    sourceStaff?: string;
    sourceEntity: string;
    sourceRemark?: string;
  };
  destination?: {
    destinationEntity?: string;
    destinationStaff?: string;
    destinationRemark?: string;
  };
  transactionReason?: string;
  dateOfTransaction: Date;
  transactionStatus: string;
  hasErrors: boolean;
  approvedByAdmin: boolean;
  adminRemark?: string;
  isDeleted: boolean;
  transactionItems: TransactionItem[];
}

const StockTransactionSchema = new Schema<StockTransactionType>(
  {
    transactionType: {
      type: String,
      required: true,
    },
    source: {
      sourceStaff: {
        type: String,
      },
      sourceEntity: {
        type: String,
        required: true,
      },
      sourceRemark: String,
    },
    destination: {
      destinationEntity: {
        type: String,
      },
      destinationStaff: {
        type: String,
      },
      destinationRemark: String,
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
      default: "pending",
    },
    hasErrors: {
      type: Boolean,
      default: false,
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
    adminRemark: String,
    isDeleted: {
      type: Boolean,
      default: false,
    },
    transactionItems: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Item",
        },
        itemByDate: [
          {
            sourceQuantity: {
              expDt: { type: Date },
              qty: { type: Number },
            },
            destinationQuantity: {
              expDt: { type: Date },
              qty: { type: Number },
            },
            destinationRemark: String,
            sourceRemark: String,
            error: {
              errorReason: {
                type: String,
                default: "NONE",
              },
              errorQty: Number,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export const StockTransactionModel = mongoose.model<StockTransactionType>(
  "StockTransaction",
  StockTransactionSchema
);
