const user = require('../data/user');
const jwt = require('jsonwebtoken');

const loginUser = async (request, response) => {
    try {
        // Getting user input details
        let { email, password } = await request.body;

        // Our saved database user 
        let userData = user.userData.filter((item) => item.email === email);

        if (userData.length === 0) {
            // If email not registered
            return response.status(200).json({ status: false, message: 'invalid email' });
        } else if (userData[0].password != password) {
            // If password don't match
            return response.status(200).json({ status: false, message: 'wrong password' });
        } else if (userData[0].email === email && userData[0].password === password) {
            // JWT Token
            const token = await jwt.sign({ email: userData[0].email, role: userData[0].role }, process.env.JSON_WEB_TOKEN_SECRET);

            console.log(token);

            // Sending cookie
            response.cookie('authtoken', token);

            return response.status(200).json({ status: true, message: 'login successfull' });
        }
    } catch (error) {
        response.status.json(error);
    }
}

const logoutUser = async (request, response) => {
    try {
        response.clearCookie('authtoken');
        response.status(200).json({ status: true, message: 'logout user' });
    } catch (error) {
        response.status(500).json(error);
    }
}

module.exports = { loginUser, logoutUser };