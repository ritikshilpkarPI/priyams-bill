const mongoose = require("mongoose");
// const bcryptjs = require("bcryptjs");
// const jwt = require("jsonwebtoken");
const ItemSchem = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    itemBarcode: { type: Number },
    itemStockQuantity: { type: Number, default: 0 },
    minimumStockQuantity: { type: Number, default: 1 },
    itemMRPperUnit: { type: Number, required: true, default: 0 },
    itemDiscountPerUnit: { type: Number, default: 0 },
    itemPerUnitDiscountPercentage: { type: Number, default: 0 },
    itemCostPricePerUnit: {
      type: Number,
    },
    itemSellingPricePerUnit: {
      type: Number,
    },
    createdAt: { type: Date, default: Date.now },
    lastUpdateAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

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
          type: mongoose.Schema.Types.ObjectId,
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

const Item = mongoose.model("Item", ItemSchem);
const Bill = mongoose.model("Bill", BillSchema);

module.exports = { Bill, Item };
