import mongoose, { Schema } from 'mongoose';

const DealerSchema = new Schema<DealerModelInterface>(
  {
    dealerName: {
      type: String,
    },
    dealerAddress: [
      {
        address: { type: String },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    dealerContactNumber: [
      {
        contactNumber: { type: String },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    dealerVisitingCard: {
      publicId: { type: String },
      secureUrl: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const Dealer = mongoose.model<DealerModelInterface>('Dealer', DealerSchema);

module.exports = { Dealer };
