const { Item } = require('../db-models/item-model');

const editItemById = async (req, res) => {
    try {
      const { id, itemToBeUpdated } = req.body;
      const changedItem = await Item.findByIdAndUpdate(id, itemToBeUpdated, {
        new: true,
      });
      res.status(200).json({ message: changedItem });
    } catch (error) {
      console.error(error);
      res.status(501).json({ error });
    }
  };

  module.exports = {
    editItemById,
  };