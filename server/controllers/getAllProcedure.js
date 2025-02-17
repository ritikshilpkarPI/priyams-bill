const { OpenClose } = require('../db-models/open-close-model');

const getAllProcedure = async (req, res,next) => {
    try {
      const procedures = await OpenClose.find();
      const procedureCount = await OpenClose.countDocuments();
      res.status(200).json({ message: { procedures, procedureCount } });
    } catch (error) {
      next(error)
    }
  };

  module.exports = getAllProcedure;