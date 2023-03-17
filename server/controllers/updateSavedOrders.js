const PurchaseOrder = require('../db-models/purchase-order-model');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const updateSavedOrders = async (req, res) => {
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
    } catch (err) {
      res.status(400).send({ message: err, success: false });
    }
  };

  module.exports = {
    updateSavedOrders,
  };