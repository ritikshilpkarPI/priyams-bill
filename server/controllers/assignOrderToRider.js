const { BadRequest, NotFound } = require("../util/errors");
const { isValidObjectId } = require("mongoose");
const { Order } = require("../db-models/orderSchema");

const assignOrderToRider = async (req, res, next) => {
  try {
    const { riderId, orderId } = req.body;

    if (!riderId || !orderId) {
      throw new BadRequest( "riderId and orderId are required");
    }

    if (!isValidObjectId(riderId)) {
      throw new BadRequest("Invalid riderId format");
    }
    if (!isValidObjectId(orderId)) {
      throw new BadRequest("Invalid orderId format");
    }

    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      throw new NotFound('Order not found');
    }
    if (order.riderId) {
        throw new BadRequest(`Order is already assigned to rider`);
    }
    
    Object.assign(order, { riderId });
    const updatedOrder = await order.save();

    return res.status(200).json({
      message: "Order assigned to rider successfully",
      order: updatedOrder,
    });
  } catch (error) {
    next({
      responseCode: error.code || 400,
      message: error.message ||"Bad Request",
      err: error,
    });
  }
};

module.exports = assignOrderToRider ;
