const { OpenClose } = require('../db-models/open-close-model');

const getAllProcedure = async (req, res) => {
    try {
      const procedures = await OpenClose.find({ isDeleted: false });
      const procedureCount = await OpenClose.countDocuments();
      res.status(200).json({ message: { procedures, procedureCount } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = getAllProcedure;