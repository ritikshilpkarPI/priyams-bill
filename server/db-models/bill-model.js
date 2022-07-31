const mongoose = require("mongoose");
const { Schema } = mongoose;

const BillSchema = new mongoose.Schema(
  {
    customerName: { type: String },
    customerPhone: { type: Number },
    billMRPTotal: { type: Number },
    billAmountTotal: { type: Number },
    billDiscountTotal: { type: Number },
    billPercentageDiscountTotal: { type: Number },
    totalNumberOfUniqueItems: { type: Number },
    totalNumberOfItems: { type: Number },
    items: [
      {
        itemDetail: {
          type: Schema.Types.ObjectId,
          ref: "Item",
        },
        itemQuantityInBill: { type: Number },
        itemMRPtotal: { type: Number },
        itemDiscountTotal: { type: Number },
        itemSellingPriceTotal: { type: Number },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Bill = mongoose.model("Bill", BillSchema);

module.exports = { Bill };
