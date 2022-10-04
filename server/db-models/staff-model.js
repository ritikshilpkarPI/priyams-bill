const mongoose = require('mongoose');
const ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    STAFF: 'staff'
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
    }
});

const Staff = new mongoose.model('staff', staffSchema);

module.exports = Staff;