const mongoose = require("mongoose");

const OpenCloseSchema = new mongoose.Schema(
  {
    procedure: { type: String },
    notesSum: { type: Number },
    coinsSum: { type: Number },
    totalSum: { type: Number },
    notes: {
      twoThousand: { type: Number },
      fiveHundred: { type: Number },
      twoHundred: { type: Number },
      oneHundred: { type: Number },
      fifty: { type: Number },
      twenty: { type: Number },
      ten: { type: Number },
      five: { type: Number },
      two: { type: Number },
      one: { type: Number },
    },
    coins: {
      twoThousand: { type: Number },
      fiveHundred: { type: Number },
      twoHundred: { type: Number },
      oneHundred: { type: Number },
      fifty: { type: Number },
      twenty: { type: Number },
      ten: { type: Number },
      five: { type: Number },
      two: { type: Number },
      one: { type: Number },
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const OpenClose = mongoose.model("OpenClose", OpenCloseSchema);
module.exports = { OpenClose };
