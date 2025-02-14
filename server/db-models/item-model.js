const mongoose = require('mongoose');
const { getItemSKU } = require('../util/getItemSKU');
const inventoryItemCategory = [
  'Bakery',
  'Beverage',
  'Dairy and Frozen',
  'Staple',
  'Personal care',
  'Packaged Food',
  'Home and Kitchen',
  'Stationery',
  'Grocery',
  'Baby and kids',
  'Electronic',
  'Spices and fast food',
  'Pooja',
  'Oil and ghee',
  'Sweet and Chocolate',
  'Plastic',
  'Miscellanous',
];

const ItemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true, trim: true },
    itemBarcode: { type: String },
    sku: { type: String },
    itemStockQuantity: { type: Number, default: 0 },
    minimumStockQuantity: { type: Number, default: 1 },
    itemMRPperUnit: { type: Number, required: true, default: 0 },
    itemDiscountPerUnit: { type: Number, default: 0 },
    itemPerUnitDiscountPercentage: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    permanentlyOutOfStock: {
      type: Boolean,
      default: false,
    },
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
          type: Date,
        },
        value: {
          type: Number,
        },
      },
    ],
    quantityUnitName: { type: String },
    gstPercentage: { type: Number },
    itemPerUnitQuantity: { type: Number, default: 0 },
    images: [
      {
        public_id: { type: String, required: true, unique: true },
        secure_url: { type: String, required: true, unique: true }
      },
    ]
  },
  { strict: false, timestamps: true }
);

const Item = mongoose.model('Item', ItemSchema);

ItemSchema.pre("save", function (next) {
  const itemData = this;
  itemData.sku = getItemSKU(itemData);
  next();
});

ItemSchema.pre("findOneAndUpdate", function (next) {
  const itemData = this;
  itemData.sku = getItemSKU(itemData);
  next();
});

module.exports = { Item, inventoryItemCategory, ItemSchema };
