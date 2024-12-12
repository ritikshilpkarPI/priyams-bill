const { default: mongoose } = require('mongoose');
const { orderSchema } = require('../db-models/orderSchema');

const getUserOrders = async (req, res, next) => {
  const db = mongoose.createConnection(process.env.APP_MONGODB_URI, { useNewUrlParser: true });
  const { orderStatus } = req.query;
  const Order = db.model("Orders", orderSchema);

  const query = orderStatus
    ? {
        'orderStatus.status': orderStatus,
      }
    : {};
  
  try {
    const orders = await Order.aggregate([
      {
        $match: query,
      },
     
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product", 
          foreignField: "_id",
          as: "productDetails", 
        },
      },
      {
        $unwind: "$productDetails", 
      },
      {
        $addFields: {
          "orderItems.product": "$productDetails", 
        },
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
    ]).exec();

    res.status(201).send({ message: 'got the orders', orders });
  } catch (error) {
    next(error);
  }
};

module.exports = getUserOrders;
