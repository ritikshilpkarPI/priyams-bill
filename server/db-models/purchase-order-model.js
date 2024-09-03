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
    { data: Object, createdAt: { type: Date, default: Date.now } },
  ],
});


purchaseOrderSchema.pre("save",async (purchaseOrder, next) => {
  const {isApproved,isDraft} = purchaseOrder;
  if(!isApproved && isDraft){
    const historyEntry = {
      data: purchaseOrder.toObject(), 
      createdAt: Date.now(), 
    };
    
    // Add to draftHistory and save the document
    purchaseOrder.statusHistory.push(historyEntry);

    // Save the updated document with the new draft history entry
    await purchaseOrder.save();
  }
  next();
});


module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
