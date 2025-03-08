import mongoose from 'mongoose';

const returnItemSchema = new mongoose.Schema(
  {
    originalBillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bill'
    },
    returnedItems: [
      {
        itemDetail: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Item',
        },
        itemQuantityInBill: {
          type: Number
        },
      },
    ],
    exchangeBillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bill'
    },
    returnDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ReturnItem =  mongoose.model('ReturnItem', returnItemSchema);

module.exports = { ReturnItem }
