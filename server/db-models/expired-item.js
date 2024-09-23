const mongoose = require('mongoose');

const ExpiredItemSchema = new mongoose.Schema({
  itemId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Item',
    required: true 
  }, 
  expireDate: { type: Date },
  isExpired: { type: Boolean },
  isDamaged: { type: Boolean },
  totalItems: { type: Number }
}, { timestamps: true }); 

const ExpiredItem = mongoose.model('expiredItems', ExpiredItemSchema);
module.exports = { ExpiredItem };
