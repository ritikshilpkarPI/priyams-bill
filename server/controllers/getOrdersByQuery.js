const PurchaseOrder = require('../db-models/purchase-order-model');


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