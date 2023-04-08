const { Order } = require('../db-models/orderSchema');

const getUserOrders = async (req, res, next) => {
  const { orderStatus } = req.query;
  const query = orderStatus
    ? {
      'orderStatus.value': orderStatus,
      }
    : {}
  try {
    const orders = await Order.aggregate([
      {
        $match: query
      },
      {
        $group: {
          _id: '$orderStatus.value',
          orders: {
            $push: '$$ROOT',
          },
        },
      },
    ]);
    console.log({orders});
    res.status(201).send({ message: 'got the orders', orders });
  } catch (error) {
    next(error);
  }
};

module.exports = getUserOrders;
