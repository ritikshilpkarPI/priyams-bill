const PurchaseOrder = require('../db-models/purchase-order-model');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const getOrders = async (req, res) => {
    try {
      const orders = await PurchaseOrder.find({});
      res.status(201).send({ message: 'got the orders', orders });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  };

  module.exports = {
    getOrders,
  };