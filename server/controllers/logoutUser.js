const logoutUser = async (request, response) => {
    try {
      response.status(200).json({ status: true, message: 'logout user' });
    } catch (error) {
      response.status(500).json(error);
    }
  };

module.exports = logoutUser;