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
   const user = await Staff.findById(decoded.id);
    req.user = user
    req.body.username = user.username
    next();
  } catch (error) {
    next(error);
  }
};


module.exports = {
  isAdmin,
  isLoggedIn,
};
