const { Order } = require('../db-models/orderSchema');

const getUserOrders = async (req, res, next) => {
  const { orderStatus } = req.query;
  const query = orderStatus
    ? {
        $in: {
          orderStatus: { status: orderStatus },
        },
      }
    : {};
  try {
    const orders = await Order.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: {
            $last: '$orderStatus.status',
          },
          orders: {
            $push: '$$ROOT',
          },
        },
      },
    ]);
    res.status(201).send({ message: 'got the orders', orders });
  } catch (error) {
    next(error);
  }
};

module.exports = getUserOrders;
