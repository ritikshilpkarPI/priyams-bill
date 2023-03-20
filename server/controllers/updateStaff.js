const Staff = require('../db-models/staff-model');

const updateStaff = async (request, response) => {
    try {
      const username = request.params.username;
      const staffUpdate = await Staff.findOneAndUpdate(
        { username: username },
        request.body
      );
      response.status(200).json({
        status: true,
        message: 'staff updated!',
        updatedItem: staffUpdate,
      });
    } catch (error) {
      response.status(500).json(error);
    }
  };

  module.exports = updateStaff;