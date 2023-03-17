const PurchaseOrder = require('../db-models/purchase-order-model');

const deleteOrderItemById = async (req, res) => {
    try {
      const purchase_id = req.params.id;
      const { itemId } = req.body;
      const purchaseOrder = await PurchaseOrder.findById(purchase_id);
      const purchasedItems = purchaseOrder.purchasedItems.filter(
        (order) => order._id != itemId
      );
      const updatedOrder = await purchaseOrder.updateOne({ purchasedItems });
      res.status(200).send({
        message: 'order deleted successfully',
        success: true,
        order: purchaseOrder,
        updatedOrder,
      });
    } catch (err) {
      res.status(400).send({ message: err, success: false });
    }
  };

  module.exports = {
    deleteOrderItemById,
  };