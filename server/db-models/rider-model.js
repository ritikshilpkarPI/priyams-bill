const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
  phone: {
    type: String,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  rating: {
    type: Number,
    default: 5,
  },
  profilePhoto: {
    secureUrl: { type: String },
    public_id: { type: String },
  },
  aadharPhoto: [
    {
      secureUrl: { type: String },
      public_id: { type: String },
    },
  ],
  status: {
    type: String,
    default: 'trainee',
  },
});

const Rider = mongoose.model('rider', riderSchema);

module.exports = { Rider };
