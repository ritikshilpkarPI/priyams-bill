const mongoose = require('mongoose');
const { Schema } = mongoose;

const UnSavedBillSchema = new Schema(
  {
    data: {
      type: Schema.Types.Object,
    },
  },
  {
    timestamps: true,
  }
);

const UnSavedBill = mongoose.model('unSavedBill', UnSavedBillSchema);

module.exports = { UnSavedBill };
