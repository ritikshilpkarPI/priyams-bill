const { Item } = require('../db-models/item-model');

const editItemById = async (req, res,next) => {
    try {
      const { id, itemToBeUpdated } = req.body;
      const changedItem = await Item.findByIdAndUpdate(id, itemToBeUpdated, {
        new: true,
      });
      res.status(200).json({ message: changedItem });
    } catch (error) {
      next(error)
    }
  };

  module.exports = editItemById;