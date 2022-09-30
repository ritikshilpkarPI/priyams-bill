const user = require("../data/user");
const jwt = require("jsonwebtoken");

const loginUser = async (request, response) => {
  try {
    // Getting user input details
    let { username, password } = await request.body;

    // Our saved database user
    let userData = user.userData.filter((item) => item.username === username);

    if (userData.length === 0) {
      // If email not registered
      return response
        .status(200)
        .json({ status: false, message: "invalid username" });
    } else if (userData[0].password != password) {
      // If password don't match
      return response
        .status(200)
        .json({ status: false, message: "wrong password" });
    } else if (
      userData[0].username === username &&
      userData[0].password === password
    ) {
      // JWT Token
      const token = await jwt.sign(
        { username: userData[0].username, role: userData[0].role },
        process.env.JSON_WEB_TOKEN_SECRET
      );

      console.log(token);

      // Sending cookie
      // response.cookie('authtoken', token);

      return response
        .status(200)
        .json({
          status: true,
          message: "login successfull",
          authtoken: token,
          role: userData[0].role,
          name: userData[0].name,
        });
    }
  } catch (error) {
    response.status(501).json(error);
  }
};

const logoutUser = async (request, response) => {
  try {
    response.clearCookie("authtoken");
    response.status(200).json({ status: true, message: "logout user" });
  } catch (error) {
    response.status(500).json(error);
  }
};

module.exports = { loginUser, logoutUser };
