import mongoose, { Schema } from 'mongoose';


const PaymentDetailsSchema= new Schema<PaymentDetailsSchemaInterface>(
  {
    paymentType: {
      type: String,
    },
    paymentAmount: {
      type: Number,
    },
    purchaseOrderReference: {
      type: Schema.Types.ObjectId,
      ref: 'PurchaseOrder', 
    },
    dealerReference: {
      type: Schema.Types.ObjectId,
      ref: 'Dealer', 
    },
    paymentRemarks: {
      type: String,
    },
    paymentProofImage: {
      publicId: { type: String },
      secureUrl: { type: String },
    },
  },
  {
    timestamps: true, 
  }
);

const PaymentDetails = mongoose.model('PaymentDetails', PaymentDetailsSchema);

module.exports = {PaymentDetails}
