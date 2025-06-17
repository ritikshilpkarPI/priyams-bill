const mongoose = require('mongoose');
const { BrandModel } = require('./brand-model');
const { CompanyModel } = require('./company-model');
const { imageSchema } = require('./image-model');

const purchaseOrderSchema = new mongoose.Schema({
  purchasedItems: [
    {
      barcode: String,
      inputName: String,
      sku: String,
      stockQuantity: Number,
      minimumQuantity: Number,
      itemQuantity: Number,
      unit: String,
      itemRemark: String,
      sellingPrice: Number,
      mrp: Number,
      costPrice: Number,
      currentStock: Number,
      validate: Boolean,
      item_id: String,
      brand: String,
      brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
      },
      companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
      },
      category: String,
      subCategory: String,
      flavourOrFeature: String,
      freeItemsAvailable: Boolean,
      freeItemsRemarks: String,
      returnPolicyAvailable: Boolean,
      returnPolicyRemarks: String,
      companyName: String,
      saleTime: String,
      images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
      }],
      createdAt: { type: Date, default: Date.now },
      itemHasExpiry: { type: Boolean, default: null },
      expiryDates: [
        {
          date: Date,
          value: Number,
          mfgDate: Date,
          isShelfExpired: Boolean
        },
      ],
      slabPrice: [],
      profitPercentage: { type: Number},
      newItem: {
        type: Boolean,
        default: false,
      },
    },
  ],
  purchaseDetails: {
    totalPayableAmount: Number,
    totalBillAmount: Number,
    paymentType: String,
    totalItemsCost: Number,
    remark: String,

    credits: [
      {
        creditAmount: Number,
        payDate: String, 
        creditLimitInDays: Number,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    payments: [
      {
        paymentDate: { type: Date, default: Date.now },
        paidBy: String,
       paymentImgURL: [{
          public_id: String,
          secure_url: String,
        }],
        paidAmount: Number,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  billPhotos: [
    {
      public_id: String,
      secure_url: String,
    },
  ],
  billAmount: { type: Number, default: 0 },
  remark: String,
  totalPaidAmount: {
    type: Number,
    default: 0,
  },
  payment: String,
  procurementSource: String,
  dealerName: String,
  phoneNumber: Number,
  isDraft: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  isApproved: {
    type: Boolean,
    default: false,
  },
  isRejected: {
    type: Boolean,
    default: false,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  payBillImage: [
    {
      public_id: String,
      secure_url: String,
    },
  ],
  draftTime: Date,
  approveTime: Date,
  paidTime: Date,
  rejectTime: Date,
  statusHistory: [
    {
      data: {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        status: { type: String },
        browser: { type: String },
        os: { type: String },
        ipAddress: { type: String },
        referer: { type: String },
        rejectMessage: { type: String },
      },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  dealerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dealer', 
  },
  salesmanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Salesman', 
  },
  dateOnBill: {
    type: Date
  },
});


purchaseOrderSchema.pre("save", function (next) {
  const purchaseOrder = this;
  const { isApproved, isDraft } = purchaseOrder;

    // If the purchase order is a draft and not yet approved
  if (!isApproved && isDraft) {
    const historyEntry = {
      data: purchaseOrder.toObject(), 
      createdAt: Date.now(), 
    };

        // Add to statusHistory array
    purchaseOrder.statusHistory.push(historyEntry);
  }

    // No need for next() with async operations or save recursion
  next();
});


module.exports =  mongoose.model('PurchaseOrder', purchaseOrderSchema);