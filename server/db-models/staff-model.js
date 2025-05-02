const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
};

const staffTypeEnum = {
  STORE: "STORE",
  WAREHOUSE: "WAREHOUSE"
};
     
const staffSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    enum: ROLES,
  },
  password: {
    type: String,
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store', 
  },
  allowedRoutes: {
    type: [String],
  },
  staffType: {
    type: String,
    enum: staffTypeEnum
  },
});
staffSchema.methods.getJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      role: this.role,
      username: this.username,
      storeId: this.storeId,
      allowedRoutes: this.allowedRoutes,
      staffType: this.staffType
    },
    process.env.JWT_SECRET,
    {
      expiresIn: `${process.env.JWT_EXPIRY}`,
    }
  );
};

const Staff = new mongoose.model('staff', staffSchema);

module.exports = Staff;
