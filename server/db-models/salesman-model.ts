import mongoose, { Schema } from 'mongoose';



const SalesmanSchema: Schema = new Schema(
  {
    salesmanName: {
      type: String,
      required: false, 
    },
    salesmanContactNumber: [
      {
        contactNumber: { type: String, required: false }, 
        updatedAt: { type: Date, default: Date.now }, 
      },
    ],
    dealerReference: {
      type: Schema.Types.ObjectId,
      ref: 'Dealer',
      required: false, 
    },
  },
  {
    timestamps: true, 
  }
);

const Salesman = mongoose.model<SalesmanSchemaInterface>('Salesman', SalesmanSchema);

module.exports = { Salesman };
