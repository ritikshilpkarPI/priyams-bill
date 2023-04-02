const Staff = require('../db-models/staff-model');

const deleteStaff = async (request, response,next) => {
    try {
      const username = request.params.username;
      await Staff.findOneAndDelete({ username: username });
      response.status(200).json({ status: true, message: 'staff deleted!' });
    } catch (error) {
      next(error)
    }
  };

  module.exports = deleteStaff;