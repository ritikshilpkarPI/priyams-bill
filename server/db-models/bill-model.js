const mongoose = require('mongoose');
const { Schema } = mongoose;

const BillSchema = new mongoose.Schema(
  {
    customerName: { type: String },
    slug: { type: String },
    customerPhone: { type: Number },
    billMRPTotal: { type: Number },
    billAmountTotal: { type: Number },
    billDiscountTotal: { type: Number },
    billPercentageDiscountTotal: { type: Number },
    totalNumberOfUniqueItems: { type: Number },
    totalNumberOfItems: { type: Number },
    totalBillProfit: { type: Number },
    messageSend: { type: Boolean, default: false },
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
    cashPay: { type: Number },
    upiPay: { type: Number },
    isUpiAmtPaid: { type: Boolean },
    rzpPaymentId: { type: String },
    amountReturn: { type: Number },
    createdAt: { type: Date, default: Date.now },
    updated: { type: Array, default: Date.now },
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    returnBills: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ReturnBill',
      },
    ],
    parentBillId: { type: String },
    billRefund: { type: String },
    staffId:{
      type: Schema.Types.ObjectId,
      ref: 'staff',
    },
  },
  {
    timestamps: true,
  }
);

const Bill = mongoose.model('Bill', BillSchema);

module.exports = { Bill };
