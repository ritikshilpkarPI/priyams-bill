const { getItemSKU } = require('../util/getItemSKU');
const PurchaseOrder = require('../db-models/purchase-order-model');

const updateOrderByIndex = async (req, res,next) => {
    try {
      const purchase_id = req.params.id;
      const { index, new_order } = req.body;
      new_order.sku = getItemSKU(
        {
          itemQuantity: new_order.itemQuantity,
          unit: new_order.unit,
          itemName: new_order.inputName,
          barcode: new_order.barcode,
          mrp: new_order.mrp
       });
      const purchaseOrder = await PurchaseOrder.findById(purchase_id);
      
      const purchasedItems = [
        ...purchaseOrder.purchasedItems.filter((order, i) => i !== index),
        new_order,
      ];
      purchaseOrder.purchasedItems= purchasedItems

      const totalItemsCost = purchaseOrder.purchasedItems.reduce((total, item) => {
          return total + (item.costPrice * item.stockQuantity);
      }, 0);

      purchaseOrder.purchaseDetails.totalItemsCost = totalItemsCost;

      await purchaseOrder.save();
      
      res.status(200).send({
        message: 'order updated successfully',
        success: true,
        order: purchaseOrder,
      });
    } catch (error) {
      next(error)
    }
  };

  module.exports = updateOrderByIndex;