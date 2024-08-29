const mongoose = require('mongoose');

const purchaseOrderSchema = new mongoose.Schema({
  purchasedItems: [
    {
      barcode: String,
      inputName: String,
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
      imageUrl: {
        public_id: String,
        secure_url: String
      },
      createdAt: { type: Date, default: Date.now },
      expiryDates: [
        {
          date: Date,
          value: Number,
        },
      ],
      slabPrice: [],
    },
  ],
  purchaseDetails: [
    {
      paidAmount: {
        type: Number,
        default: 0,
      },
      paidBy: String,
      chequeNumber: String,
    },
  ],
  billPhotos: [
    {
      public_id: String,
      secure_url: String,
    },
  ],
  billAmount: Number,
  remark: String,
  totalPaidAmount: {
    type: String,
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
});

// pre hook to make is Approved true or false if approver is their

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
