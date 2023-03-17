const PurchaseOrder = require('../db-models/purchase-order-model');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const getOrdersByQuery = async (req, res) => {
    try {
      const { query } = req.body;
      const orders = await PurchaseOrder.find(query);
      res.status(200).send({ message: 'orders found', orders });
    } catch (err) {
      res.status(400).send({ message: err });
    }
  };

  module.exports = {
    getOrdersByQuery,
  };