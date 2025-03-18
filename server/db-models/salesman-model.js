const mongoose = require('mongoose');
const { Schema } = mongoose;

const SalesmanSchema = new Schema(
  {
    salesmanName: {
      type: String,
      required: false, 
    },
    salesmanContactNumber: [{ type: String }], 
    dealerId: {
      type: Schema.Types.ObjectId,
      ref: 'Dealer',
    },
  },
  {
    timestamps: true, 
  }
);

const Salesman = mongoose.model('Salesman', SalesmanSchema);

module.exports = { Salesman };
