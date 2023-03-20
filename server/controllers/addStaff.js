const Staff = require('../db-models/staff-model');

const addStaff = async (request, response) => {
  try {
    const { name, username, role, password } = request.body;

    if (!name || !username || !role || !password) {
      return response
        .status(200)
        .json({ status: false, message: 'please provide all details!' });
    }

    const staffDetail = await new Staff(request.body);
    staffDetail.save();
    response
      .status(200)
      .json({ status: true, message: 'staff added!', staffDetail });
  } catch (error) {
    response.status(500).json(error);
  }
};





module.exports = addStaff;
