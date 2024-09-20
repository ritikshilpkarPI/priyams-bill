const { OpenClose } = require('../db-models/open-close-model');

const editOpenCloseProcedure = async (req, res,next) => {
    try {
      const { id, procedureToBeUpdated } = req.body;
      const changeOpenCloseProcedure = await OpenClose.findByIdAndUpdate(
        id,
        {
          $set: { ...procedureToBeUpdated }
        },
        {
          new: true,
        }
      );
      
      res.status(200).json({ message: changeOpenCloseProcedure });
    } catch (error) {
      next(error)
    }
  };

  module.exports = editOpenCloseProcedure;