const PurchaseOrder = require('../db-models/purchase-order-model');


const getOrders = async (req, res,next) => {
    try {
      const orders = await PurchaseOrder.find({});
      res.status(201).send({ message: 'got the orders', orders });
    } catch (error) {
      next(error)
    }
  };

  module.exports = getOrders;