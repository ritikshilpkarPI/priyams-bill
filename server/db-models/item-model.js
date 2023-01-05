const mongoose = require("mongoose");
const quantityUnitNameEnum = ["kg", "grams", "liter", "ml", "Piece"];
const inventoryItemCategory =['Bakery', 'Beverage', 'Dairy and Frozen', 'Staple', 'Personal care', 'Packaged Food', 'Home and Kitchen', 'Stationery', 'Grocery', 'Baby and kids', 'Electronic', 'Spices and fast food', 'Pooja', 'Oil and ghee', 'Sweet and Chocolate', 'Plastic', 'Miscellanous'];

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
    itemBrandName: { type: String },
    itemCategory: { type: String, enum: inventoryItemCategory },
    useByDate: [
      {
        date: {
          type: Date
        },
        value: {
          type: Number
        }
      }
    ],
    quantityUnitName: { type: String, enum: quantityUnitNameEnum },
    gstPercentage: { type: Number },
    itemPerUnitQuantity: { type: Number,  default: 0 },
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
