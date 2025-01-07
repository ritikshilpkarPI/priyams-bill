const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReturnBillSchema = new mongoose.Schema(
  {
    customerName: { type: String },
    slug: { type: String },
    customerPhone: { type: Number },
    billMRPTotal: { type: Number },
    billAmountTotal: { type: Number },
    existingbillAmountTotal: { type: Number },
    billDiscountTotal: { type: Number },
    billPercentageDiscountTotal: { type: Number },
    totalNumberOfUniqueItems: { type: Number },
    totalNumberOfItems: { type: Number },
    totalBillProfit: { type: Number },
    messageSend: { type: Boolean, default: false },
    billId: {
      type: Schema.Types.ObjectId,
      ref: 'Bill',
    },
    itemsReturned: [
      {
        itemDetail: {
          type: Schema.Types.ObjectId,
          ref: 'Item',
        },
        itemQuantityInBill: { type: Number },
        itemMRPtotal: { type: Number },
        itemDiscountTotal: { type: Number },
        itemSellingPriceTotal: { type: Number },
      },
    ],
    items: [
      {
        itemDetail: {
          type: Schema.Types.ObjectId,
          ref: 'Item',
        },
        itemQuantityInBill: { type: Number },
        itemMRPtotal: { type: Number },
        itemDiscountTotal: { type: Number },
        itemSellingPriceTotal: { type: Number },
      },
    ],
    refundAmount: { type: Number },
    totalRefundAmount: { type: Number },
    cashPay: { type: Number },
    upiPay: { type: Number },
    amountReturn: { type: Number }
  },
  {
    timestamps: true,
  }
);

const ReturnBill = mongoose.model('ReturnBill', ReturnBillSchema);

module.exports = { ReturnBill };
