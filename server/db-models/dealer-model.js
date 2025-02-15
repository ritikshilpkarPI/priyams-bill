const mongoose = require('mongoose');
const { Schema } = mongoose;

const DealerSchema = new Schema(
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
    dealerVisitingCard: [
      { publicId: { type: String }, secureUrl: { type: String } },
    ],
  },
  {
    timestamps: true,
  }
);

const Dealer = mongoose.model('Dealer', DealerSchema);

module.exports = { Dealer };
