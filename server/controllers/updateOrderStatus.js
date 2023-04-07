const { ORDER_STATUS } = require('../util/order');
const {Order} = require('../db-models/orderSchema');

const updateOrderStatus = async (req, res,next) => {
    const { step, id } = req.body;
    const orderStatus = {
      step,
      value: ORDER_STATUS[`step${step}`]
    }
    try {
      const order = await Order.findByIdAndUpdate(id, {orderStatus}, {new: true});
      res.status(201).send({ message: 'Order status update successfully', order });  
    } catch (error) {
      next(error)
    }
  };

  module.exports = updateOrderStatus;