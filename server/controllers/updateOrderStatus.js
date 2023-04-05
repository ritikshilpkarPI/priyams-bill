const {Order} = require('../db-models/orderSchema');


const updateOrderStatus = async (req, res,next) => {
    const {status,id} = req.body;
    try {
      const order = await Order.findByIdAndUpdate({id},{status});
      res.status(201).send({ message: 'Order status update successfully', order });  
    } catch (error) {
      next(error)
    }
  };

  module.exports = updateOrderStatus;