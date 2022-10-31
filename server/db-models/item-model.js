const mongoose = require("mongoose");

const ItemSchem = new mongoose.Schema(
  {
    itemName: { type: String, required: true, trim: true },
    itemBarcode: { type: Number },
    itemStockQuantity: { type: Number, default: 0 },
    minimumStockQuantity: { type: Number, default: 1 },
    itemMRPperUnit: { type: Number, required: true, default: 0 },
    itemDiscountPerUnit: { type: Number, default: 0 },
    itemPerUnitDiscountPercentage: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    itemCostPricePerUnit: {
      type: Number,
    },
    itemSellingPricePerUnit: {
      type: Number,
    },
    createdAt: { type: Date, default: Date.now },
    lastUpdateAt: { type: Date },
    slabPricing: { type: Array },
    minStockReached: { type: Boolean, default: false },
    brandName: { type: String },
    category: { type: String, enum: ["Rice", "Pulse", "Beverage", "Spice"] },
    useByDate: { type: Array },
    quantity: { type: String, enum: ["Kilo", "Grams", "Litre", "Mililiter", "Piece"] },
  },
  { strict: false, timestamps: true }
);

ItemSchem.pre(["save", "findOneAndUpdate"], function (next) {
  const updatedObj = this._update;
  if (updatedObj) {
    updatedObj.minStockReached =
      Number(updatedObj.minimumStockQuantity) >=
      Number(updatedObj.itemStockQuantity);
  } else {
    this.minStockReached =
      Number(this.minimumStockQuantity) >= Number(this.itemStockQuantity);
  }
  next();
});
const Item = mongoose.model("Item", ItemSchem);
module.exports = { Item };
