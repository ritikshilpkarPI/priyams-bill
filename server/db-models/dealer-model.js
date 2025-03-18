const mongoose = require('mongoose');
const { Schema } = mongoose;

const DealerSchema = new Schema(
  {
    dealerName: {
      type: String,
    },
    dealerAddress: [{ type: String }],
    dealerContactNumber: [{ type: String }],
    dealerVisitingCard: [{ publicId: String, secureUrl: String }],

  },
  {
    timestamps: true,
  }
);

const Dealer = mongoose.model('Dealer', DealerSchema);

module.exports = { Dealer };
