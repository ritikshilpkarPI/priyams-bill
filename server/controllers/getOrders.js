const PurchaseOrder = require('../db-models/purchase-order-model');


const getOrders = async (req, res) => {
    try {
      const orders = await PurchaseOrder.find({});
      res.status(201).send({ message: 'got the orders', orders });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  };

  module.exports = getOrders;