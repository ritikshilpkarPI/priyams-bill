import mongoose, { Schema } from 'mongoose';


const PaymentDetailsSchema= new Schema<PaymentDetailsModelInterface>(
  {
    paymentType: {
      type: String,
      enum: ['Cash', 'Cheque', 'UPI', 'NEFT'], 
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

const PaymentDetails = mongoose.model<PaymentDetailsModelInterface>('PaymentDetails', PaymentDetailsSchema);

module.exports = {PaymentDetails}
