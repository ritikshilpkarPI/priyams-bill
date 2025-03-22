const PurchaseOrder = require('../db-models/purchase-order-model');

const deleteOrderItemById = async (req, res,next) => {
    try {
      const purchase_id = req.params.id;
      const { itemId } = req.body;
      const purchaseOrder = await PurchaseOrder.findById(purchase_id);

        const itemToRemove = purchaseOrder.purchasedItems.find(
            (order) => order._id.toString() === itemId
        );

        const itemTotalCost = (itemToRemove.costPrice || 0) * (itemToRemove.stockQuantity || 0);

        purchaseOrder.purchasedItems = purchaseOrder.purchasedItems.filter(
            (order) => order._id.toString() !== itemId
        );

        purchaseOrder.purchaseDetails.totalItemsCost -= itemTotalCost;

        await purchaseOrder.save();
      res.status(200).send({
        message: 'order deleted successfully',
        success: true,
        order: purchaseOrder,
      });
    } catch (error) {
      next(error)
    }
  };

  module.exports = deleteOrderItemById;