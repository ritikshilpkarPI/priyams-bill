// const { fields } = require('../middleware/upload');
const {Order} = require('../db-models/orderSchema');
const orderStatus =  ['pending_confirmation','pending_packaging', 'pending_dispatch','pending_delivery_dispatch','delivered_successfully'];




const filterUserOrders = async (req, res,next) => {
    try {
      const orders = await Order.find(req.query);
      console.log({orders});
      res.status(201).send({ message: 'got the orders', orders });  
    } catch (error) {
      next(error)
    }
  };

  module.exports = filterUserOrders;