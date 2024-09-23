const mongoose = require('mongoose');

const ExpiredItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
  expireDate: { type: Date },
  isExpired: { type: Boolean },
  isDamage: { type: Boolean },
  itemCount: { type: Number }
});

const ExpiredItem = mongoose.model('ExpiredProduct', ExpiredItemSchema);
module.exports = { ExpiredItem };