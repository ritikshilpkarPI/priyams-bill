const { Item } = require('../db-models/item-model');

const permanentlyOutOfStock = async (req, res,next) => {
    const { id } = req.params;
    try {
      const item = await Item.findByIdAndUpdate(
        id,
        {
          permanentlyOutOfStock: true,
        },
        {
          new: true,
        }
      );
      res.status(200).send({
        message: 'Item is successfully permanently out of stock ',
        success: true,
        item,
      });
    } catch (error) {
      next(error)
    }
  };

  module.exports = permanentlyOutOfStock;
  