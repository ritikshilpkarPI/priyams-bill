const PurchaseOrder = require('../db-models/purchase-order-model');

const getOrdersByQuery = async (req, res, next) => {
  try {
    const { query } = req.body;
    const orders = await PurchaseOrder.find(query)
      .sort({ createdAt: -1 })
      .limit(300);
    res.status(200).send({ message: 'orders found', orders });
  } catch (error) {
    next(error);
  }
};

module.exports = getOrdersByQuery;
