const { default: mongoose } = require('mongoose');
const { orderSchema } = require('../db-models/orderSchema');

const expelOrderToRider = async (req, res, next) => {
  const db = mongoose.createConnection(process.env.APP_MONGODB_URI, {
    useNewUrlParser: true,
  });
  const Order = db.model('Orders', orderSchema);
  const { orderId, riderId } = req.body;
  if (!orderId || !riderId) {
    res.status(400).json({ message: 'Order ID and Rider ID are required' });
  }
  try {

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
    }

    if (order.riderId !== riderId) {
      res
        .status(400)
        .json({ message: 'The specified rider is not assigned to this order' });
    }
    order.riderId = '';
    await order.save();

    res.status(200).json({
      message: 'Rider successfully removed from the order',
      order,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = expelOrderToRider;
