import mongoose, { Schema } from 'mongoose';



const DealerSchema: Schema = new Schema(
  {
    dealerName: {
      type: String,
      required: false, 
    },
    dealerAddress: [
      {
        address: { type: String, required: false },
        updatedAt: { type: Date, default: Date.now }, 
      },
    ],
    dealerContactNumber: [
      {
        contactNumber: { type: String, required: false }, 
        updatedAt: { type: Date, default: Date.now },
      },
    ],
    dealerVisitingCard: {
      type: String,
      required: false, 
    },
  },
  {
    timestamps: true, 
  }
);

const Dealer = mongoose.model<DealerSchemaInterface>('Dealer', DealerSchema);

module.exports = {Dealer}
