const Staff = require('../db-models/staff-model');

const getStaff = async (request, response) => {
  try {
    const allStaffDetails = await Staff.find();
    response.status(200).json({
      status: true,
      message: 'details sent!',
      details: allStaffDetails,
    });
  } catch (error) {
    response.status(500).json(error);
  }
};

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

const deleteStaff = async (request, response) => {
  try {
    const username = request.params.username;
    await Staff.findOneAndDelete({ username: username });
    response.status(200).json({ status: true, message: 'staff deleted!' });
  } catch (error) {
    response.status(500).json(error);
  }
};

module.exports = { getStaff, addStaff, updateStaff, deleteStaff };
