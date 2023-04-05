// const { fields } = require('../middleware/upload');
const {Order} = require('../db-models/orderSchema');
const orderStatus =  ['pending_confirmation','pending_packaging', 'pending_dispatch','pending_delivery_dispatch','delivered_successfully'];




const getUserOrderById = async (req, res,next) => {
  const {id} = req.params
    try {
      const order = await Order.findById(id);
      console.log({order});
      res.status(201).send({ message: 'got the order', order });  
    } catch (error) {
      next(error)
    }
  };

  module.exports = getUserOrderById;