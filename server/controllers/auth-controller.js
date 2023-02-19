const Staff = require('../db-models/staff-model');
const jwt = require('jsonwebtoken');

const loginUser = async (request, response) => {
  const { username, password } = request.body;
  let userData;
  try {
    // Our saved database user
    userData = await Staff.find({ username });
  } catch (error) {
    response.status(501).json({ error });
  }

  if (userData.length === 0) {
    // If email not registered
    return response
      .status(200)
      .json({ status: false, message: 'invalid username' });
  } else if (userData[0].password != password) {
    // If password don't match
    return response
      .status(200)
      .json({ status: false, message: 'wrong password' });
  } else if (
    userData[0].username === username &&
    userData[0].password === password
  ) {
    // JWT Token
    const token = jwt.sign(
      { username: userData[0].username, role: userData[0].role },
      process.env.JSON_WEB_TOKEN_SECRET
    );

    return response.status(200).json({
      status: true,
      message: 'login successfull',
      authtoken: token,
      role: userData[0].role,
      name: userData[0].name,
    });
  }
};

const logoutUser = async (request, response) => {
  try {
    response.status(200).json({ status: true, message: 'logout user' });
  } catch (error) {
    response.status(500).json(error);
  }
};

module.exports = { loginUser, logoutUser };
