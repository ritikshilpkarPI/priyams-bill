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

  module.exports = { 
    getStaff, 
  };