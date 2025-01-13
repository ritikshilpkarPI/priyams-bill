const { default: mongoose } = require('mongoose');
const { orderSchema } = require('../db-models/orderSchema');
const { Rider } = require('../db-models/rider-model');
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
        $addFields: {
          "orderItems": {
            $map: {
              input: "$orderItems",
              as: "orderItem",
              in: {
                $mergeObjects: [
                  "$$orderItem", 
                  {
                    product: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$productDetails",
                            as: "productDetail",
                            cond: { $eq: ["$$productDetail._id", "$$orderItem.product"] },
                          },
                        },
                        0, 
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: {
            $last: "$orderStatus.status",
          },
          orders: {
            $push: "$$ROOT", 
          },
        },
      },
    ]).exec();

    for (const group of orders) {
      for (const order of group.orders) {
        if (order.riderId) {
          const rider = await Rider.findById(order.riderId).lean();          
          order.rider = rider || null;
        } else {
          order.rider = null;
        }
      }
    }
    res.status(201).send({ message: 'got the orders', orders });
  } catch (error) {
    next(error);
  }
};

module.exports = getUserOrders;
