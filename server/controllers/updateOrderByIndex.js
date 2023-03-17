const PurchaseOrder = require('../db-models/purchase-order-model');

const updateOrderByIndex = async (req, res) => {
    try {
      const purchase_id = req.params.id;
      const { index, new_order } = req.body;
      const purchaseOrder = await PurchaseOrder.findById(purchase_id);
      const purchasedItems = [
        ...purchaseOrder.purchasedItems.filter((order, i) => i != index),
        new_order,
      ];
      const updatedOrder = await purchaseOrder.updateOne({ purchasedItems });
      res.status(200).send({
        message: 'order updated successfully',
        success: true,
        order: purchaseOrder,
        updatedOrder,
      });
    } catch (err) {
      res.status(400).send({ message: err, success: false });
    }
  };

  module.exports = {
    updateOrderByIndex,
  };