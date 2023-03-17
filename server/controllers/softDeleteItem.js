const { Item } = require('../db-models/item-model');

const softDeleteItem = async (req, res) => {
    try {
      const { id } = req.body;
      await Item.findByIdAndUpdate(id, { isDeleted: true });
      let items = await Item.find();
      items = items.filter((item) => !item.isDeleted);
      res.status(200).json({ message: 'item soft deleted!', items: items });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  module.exports = {
    softDeleteItem,
  };