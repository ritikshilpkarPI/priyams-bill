const { ExpiredItem } = require('../db-models/expired-item');
const { Item } = require('../db-models/item-model');
const updateItem = async (id, totalItems) => {
    try {
      const item = await Item.findById(id);
      
      if (!item) {
        throw new Error('Item not found');
      }
  
      const totalItemsNumber = Number(totalItems);
      if (isNaN(totalItemsNumber)) {
        throw new Error('Invalid totalItems value, must be a number');
      }
  
      const newStockQuantity = item.itemStockQuantity - totalItemsNumber;
  
      if (isNaN(newStockQuantity) || newStockQuantity < 0) {
        throw new Error('New stock quantity is invalid or below 0');
      }
  
      item.itemStockQuantity = newStockQuantity;
      await item.save();
  
    } catch (error) {
      throw new Error(`Error updating item: ${error.message}`);
    }
  };

  const addExpiredItem = async (req, res, next) => {
    const { itemId, expireDate, isExpired, isDamaged, totalItems } = req.body;
  
    try {
      if (isNaN(Number(totalItems))) {
        return res.status(400).json({ status: false, message: 'Invalid totalItems value' });
      }
  
      const newExpiredItems = await new ExpiredItem({
        itemId,
        expireDate,
        isExpired,
        isDamaged,
        totalItems
      }).save();
  
      await updateItem(itemId, totalItems);
  
      res.status(200).json({ status: true, message: 'Expired items added', newExpiredItems });
  
    } catch (error) {
      console.log({ error });
      res.status(400).json({ message: error.message });
    }
  };
  

module.exports = addExpiredItem;