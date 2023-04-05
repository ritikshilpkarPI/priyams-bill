// const { fields } = require('../middleware/upload');
const {Order} = require('../db-models/orderSchema');
const orderStatus =  ['pending_confirmation','pending_packaging', 'pending_dispatch','pending_delivery_dispatch','delivered_successfully'];




const getUserOrders = async (req, res,next) => {
    const {orderStatus} = req.query
    console.log({orderStatus});
    try {
      const orders = await Order.aggregate([
        {
          $match: {
            orderStatus
          }
        },
        {$group: {
          _id: "$orderStatus",
          orders: {
            $push: "$$ROOT"
          }
        }},
      ]);
      res.status(201).send({ message: 'got the orders', orders });  
    } catch (error) {
      next(error)
    }
  };

  module.exports = getUserOrders;