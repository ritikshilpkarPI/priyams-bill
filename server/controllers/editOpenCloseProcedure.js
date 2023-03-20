const { OpenClose } = require('../db-models/open-close-model');

const editOpenCloseProcedure = async (req, res) => {
    try {
      const { id, procedureToBeUpdated } = req.body;
      const changeOpenCloseProcedure = await OpenClose.findByIdAndUpdate(
        id,
        procedureToBeUpdated,
        {
          new: true,
        }
      );
  
      res.status(200).json({ message: changeOpenCloseProcedure });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = editOpenCloseProcedure;