const { getItemNameByItem } = require('../util/getItemNameByItem');
const PurchaseOrder = require('../db-models/purchase-order-model');
const { isShelfExpired } = require('../util/isShelfExpired');

const updateSavedOrders = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { new_order } = req.body;
    const itemName = getItemNameByItem(new_order);
    if(new_order.expiryDates) {
      new_order.expiryDates.forEach(expiryDates => {
        expiryDates.isShelfExpired = isShelfExpired(expiryDates.mfgDate, expiryDates.date);
      })
    }
    const purchaseOrder = await PurchaseOrder.findById(id);
    const updatedOrder = await purchaseOrder.updateOne({
      purchasedItems: [...purchaseOrder.purchasedItems, {
        ...new_order,
        inputName: itemName,
      }],
    });
    res.status(200).send({
      message: 'order added successfully',
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    next(error)
  }
};

module.exports = updateSavedOrders;