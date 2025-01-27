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

    const riderIds = new Set();
    for (const group of orders) {
      for (const order of group.orders) {
        if (order.riderId) {
          riderIds.add(order.riderId.toString());
        }
      }
    }
    
    const riders = await Rider.find({ _id: { $in: Array.from(riderIds) } }).lean();

    const riderMap = riders.reduce((acc, rider) => {
      acc[rider._id.toString()] = rider;
      return acc;
    }, {});

    for (const group of orders) {
      for (const order of group.orders) {
        order.rider = order.riderId ? riderMap[order.riderId.toString()] || null : null;        
      }
    }

    res.status(200).json({
      message: 'Orders fetched successfully',
      orders
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getUserOrders;
