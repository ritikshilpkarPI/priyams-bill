const mongoose = require('mongoose');
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
    itemBarcode: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
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
    itemCategory: { type: String },
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
    quantityUnitName: { type: String, required: true },
    gstPercentage: { type: Number },
    itemPerUnitQuantity: { type: Number, default: 0, required: true },
    images: [
      {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true }
      },
    ],
    companyName: { type: String, trim: true },
    subCategory: { type: String },
    flavourOrFeature: { type: String, trim: true }, 
    shelfLife: { type: String },
    itemShelfDates: [
      {
        expiryDate: { type: Date, required: true },
        manufacturingDate: { type: Date },
        quantity: { type: Number, required: true },
        purchaseOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' },
        entryDate: { type: Date, default: Date.now }
      }
    ],
    
    expiryDates: [
      {
        date: {
          type: Date,
        },
        value: {
          type: Number,
        },
        mfgDate: {
          type: Date,
        },
        isShelfExpired: { 
          type: Boolean
        }
      },
    ],
    saleTime: { type: String }, 
    returnPolicyAvailable: {
      type: Boolean,
      default: false,
    },
    returnPolicyRemarks: { type: String }, 
    freeItemsAvailable: { type: Boolean, default: false },
  },
  { strict: false, timestamps: true }
);

const Item = mongoose.model('Item', ItemSchema);

module.exports = { Item, inventoryItemCategory, ItemSchema };
