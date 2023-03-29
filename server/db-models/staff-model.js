const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
};

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
  },
  role: {
    type: String,
    enum: ROLES,
  },
  password: {
    type: String,
  },
});
staffSchema.methods.getJwtToken = function () {
  return jwt.sign(
    { id: this._id, name: this.name, role: this.role, username: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: `${process.env.JWT_EXPIRY}`,
    }
  );
};

const Staff = new mongoose.model('staff', staffSchema);

module.exports = Staff;
