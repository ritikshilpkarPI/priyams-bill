const mongoose = require('mongoose');

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
      category: String,
      subCategory: String,
      flavourOrFeature: String,
      freeItemsAvailable: Boolean,
      returnPolicyAvailable: Boolean,
      returnPolicyRemarks: String,
      companyName: String,
      saleTime: String,
      imageUrl: {
        public_id: String,
        secure_url: String
      },
      createdAt: { type: Date, default: Date.now },
      expiryDates: [
        {
          date: Date,
          value: Number,
          mfgDate: Date,
          isShelfExpired: Boolean,
        },
      ],
      slabPrice: [],
    },
  ],
  purchaseDetails: {
    totalPayableAmount: { type: Number, required: true },
    totalBillAmount: { type: Number, required: true },
    paymentType: { type: String,  required: true },

    credits: [
      {
        creditAmount: { type: Number, required: true },
        payDate: { type: String, required: true }, 
        creditLimitInDays: { type: Number, required: true }, 
        createdAt: { type: Date, default: Date.now },
      },
    ],

    payments: [
      {
        paymentDate: { type: Date, default: Date.now },
        paidBy: { type: String, required: true },
        paymentImgURL: [{
          public_id: String,
          secure_url: String,
        }],
        paidAmount: { type: Number, required: true },
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
  billAmount: Number,
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