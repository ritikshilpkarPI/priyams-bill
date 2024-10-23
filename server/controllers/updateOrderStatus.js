const { ORDER_STATUS } = require('../util/order');
const { Order, orderSchema } = require('../db-models/orderSchema');
const { default: mongoose } = require('mongoose');

const updateOrderStatus = async (req, res, next) => {
  const { step, id } = req.body;
  const db = mongoose.createConnection(process.env.APP_MONGODB_URI, { useNewUrlParser: true });
  const Order = db.model("Orders", orderSchema);
  const newOrderStatus = {
    step,
    status: ORDER_STATUS[`step${step}`],
    isCompleted: true,
    dateTime: new Date(),
  };
  try {
    const order = await Order.findByIdAndUpdate(
      id,
      {
        $push: {
          orderStatus: newOrderStatus,
        },
      },
      { new: true }
    );
    res
      .status(201)
      .send({ message: 'Order status update successfully', order });
  } catch (error) {
    next(error);
  }
};

module.exports = updateOrderStatus;
