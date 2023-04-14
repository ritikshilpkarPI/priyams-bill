const Staff = require('../db-models/staff-model');
const jwt = require('jsonwebtoken');

const isAdmin = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await Staff.findOne({ username });
    if (user && user.role === 'admin') {
      next();
    } else {
      res
        .status(400)
        .send({ message: 'you are not authorized', success: false });
    }
  } catch (err) {
    res.status(400).send({ message: err.message, success: false });
  }
};
const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token || '';
    if (!token) {
      res
        .status(401)
        .send({ message: 'Login first to access this page', success: false });
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Staff.findById(decoded.id);
    next();
  } catch (error) {
    next(error);
  }
};
const customRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'You are not allowed for this resource' });
      return;
    }
    next();
  };
};

module.exports = {
  isAdmin,
  isLoggedIn,
  customRole,
};
