const mongoose = require("mongoose");

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
    isDeleted: {type: Boolean, default: false}
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", ItemSchem);
module.exports = { Item };
