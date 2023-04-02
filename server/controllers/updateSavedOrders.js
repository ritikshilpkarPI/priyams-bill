const PurchaseOrder = require('../db-models/purchase-order-model');

const updateSavedOrders = async (req, res,next) => {
    try {
      const id = req.params.id;
      const { new_order } = req.body;
      const purchaseOrder = await PurchaseOrder.findById(id);
      const updatedOrder = await purchaseOrder.updateOne({
        purchasedItems: [...purchaseOrder.purchasedItems, new_order],
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