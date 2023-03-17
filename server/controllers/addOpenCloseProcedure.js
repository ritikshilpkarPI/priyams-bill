const { OpenClose } = require('../db-models/open-close-model');

const addOpenCloseProcedure = async (req, res) => {
    const { procedure, notesSum, coinsSum, totalSum, notes, coins } = req.body;
  
    try {
      const newOpenCloseProcedure = await new OpenClose({
        procedure,
        notesSum,
        coinsSum,
        totalSum,
        notes,
        coins,
      }).save();
      res.status(200).json({ message: newOpenCloseProcedure });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  module.exports = {
    addOpenCloseProcedure,
  };