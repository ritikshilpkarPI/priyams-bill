const { BadRequest } = require('../util/errors');
const Staff = require('../db-models/staff-model');

const addStaff = async (request, response,next) => {
  try {
    const { name, username, role, password } = request.body;

    if (!name || !username || !role || !password) {
      throw new BadRequest('please provide all details!')
    }

    const staffDetail = await new Staff(request.body);
    staffDetail.save();
    response
      .status(200)
      .json({ status: true, message: 'staff added!', staffDetail });
  } catch (error) {
    next(error)
  }
};





module.exports = addStaff;
