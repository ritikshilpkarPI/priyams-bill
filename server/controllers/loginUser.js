const { NotFound } = require('../util/errors');
const Staff = require('../db-models/staff-model');

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new NotFound('Please provide email and password');
    }
    const user = await Staff.findOne({ username }).select('+password');
    if (!user) {
      throw new NotFound("Username doesn't exist");
    }
    const isPasswordCorrect = user.password === password;
    if (!isPasswordCorrect) {
      throw new NotFound("Password doesn't exist");
    }
    const token = user.getJwtToken();
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_TIME * 24 * 60 * 60 * 1000
      ),
    };
    res.status(200).cookie('token', token, options).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = loginUser;
