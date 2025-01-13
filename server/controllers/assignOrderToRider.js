const mongoose = require('mongoose');
const { BadRequest, NotFound } = require('../util/errors');
const { isValidObjectId } = require('mongoose');
const { orderSchema } = require('../db-models/orderSchema'); 
const { riderSchema } = require('../db-models/rider-model'); 

const assignOrderToRider = async (req, res, next) => {
  let db;
  try {
    db = mongoose.createConnection(process.env.APP_MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const Order = db.model('Order', orderSchema);    
    const Rider = db.model('Rider', riderSchema);
    const { riderId, orderId } = req.body;

    if (!riderId || !orderId) {
      throw new BadRequest('riderId and orderId are required');
    }

    if (!isValidObjectId(riderId)) {
      throw new BadRequest('Invalid riderId format');
    }

    if (!isValidObjectId(orderId)) {
      throw new BadRequest('Invalid orderId format');
    }

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      throw new NotFound('Order not found');
    }
    const rider = await Rider.findById(riderId);
    if(!rider){
      throw new NotFound('Rider not found' );
    }
    if (order.riderId) {
      throw new BadRequest('Order is already assigned to a rider');
    }

    order.riderId = riderId;
    const updatedOrder = await order.save();

    return res.status(200).json({
      message: 'Order assigned to rider successfully',
      order: updatedOrder,
    });
  } catch (error) {
    next({
      responseCode: error.code || 400,
      message: error.message || 'Bad Request',
      err: error,
    });
  } finally {
    if (db) {
      await db.close();
    }
  }
};

module.exports = assignOrderToRider;
