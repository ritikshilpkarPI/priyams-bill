const mongoose = require("mongoose");

const DailyBillSchema = new mongoose.Schema(
  {
    totalNumberOfBillsForToday: { type: Number },
    totalBillAmount: { type: Number },
    totalMRPAmount: { type: Number },
    totalDiscountAmount: { type: Number, default: 0 },
    totalItemBilled: { type: Number, default: 1 },
    totalQuantityBilled: { type: Number, default: 0 },
    billDate: { type: Date },
    bills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bill",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const DailyBill = mongoose.model("DailyBill", DailyBillSchema);
module.exports = { DailyBill };
