import mongoose, { Schema } from 'mongoose';



const SalesmanSchema = new Schema<SalesmanSchemaInterface>(
  {
    salesmanName: {
      type: String,
      required: false, 
    },
    salesmanContactNumber: [
      {
        contactNumber: { type: String}, 
        updatedAt: { type: Date, default: Date.now }, 
      },
    ],
    dealerId: {
      type: Schema.Types.ObjectId,
      ref: 'Dealer',
    },
  },
  {
    timestamps: true, 
  }
);

const Salesman = mongoose.model<SalesmanModelInterface>('Salesman', SalesmanSchema);

module.exports = { Salesman };
