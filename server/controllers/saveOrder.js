const PurchaseOrder = require('../db-models/purchase-order-model');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const saveOrder = async (req, res) => {
    try {
      const { new_order } = req.body;
      const purchaseOrder = await PurchaseOrder.create({
        purchasedItems: [new_order],
      });
      res.status(201).send({
        message: 'order added successfully',
        success: true,
        order: purchaseOrder,
      });
    } catch (err) {
      console.log({ err });
      res.status(400).send({ message: err, success: false });
    }
  };

  module.exports = {
    saveOrder,
  };