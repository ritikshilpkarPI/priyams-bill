const { default: mongoose } = require('mongoose');
const { orderSchema } = require("../db-models/orderSchema");
const { ORDER_STATUS } = require('../util/order');

const updateUserOrderAndOrderStatus = async (request, response, next) => {
  const { selectedProductIds, updatedQuantities, orderId, step } = request.body;

  try {
    const db = mongoose.createConnection(process.env.APP_MONGODB_URI, { useNewUrlParser: true });
    const Order = db.model("Orders", orderSchema);

    const newOrderStatus = {
      step,
      status: ORDER_STATUS[`step${step}`],
      isCompleted: true,
      dateTime: new Date(),
    };

    const order = await Order.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(orderId) } }, 
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
          orderItems: {
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
    ]);

    if (!order || order.length === 0) {
      return response.status(404).send({ message: "Order not found" });
    }

    const fetchedOrder = order[0];
    const updatedItems = fetchedOrder.orderItems.map(item => {
      const itemIdString = item.product._id.toString();

      if (selectedProductIds.includes(itemIdString)) {
        const updatedQuantityEntry = updatedQuantities.find(q => q.productId === itemIdString);
        const updatedQuantity = updatedQuantityEntry ? updatedQuantityEntry.quantity : undefined;
        if (updatedQuantity != null) {
          item.quantity = updatedQuantity;
        }
        
        return item;
      }
      return null;
    }).filter(item => item !== null);

    if (updatedItems.length === 0) {
      return response.status(400).send({ message: "No products selected for update" });
    }

    const totalQuantity = updatedItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const discountAmount = updatedItems.reduce((totalDiscount, item) => {
      const itemDiscount = item.product.itemDiscountPerUnit * item.quantity;
      return totalDiscount + itemDiscount;
    }, 0);

    const orderUpdate = {
      $set: {
        totalQuantity,
        totalPayableAmount: totalPrice,
        discountAmount,
        orderItems: updatedItems,
      },
      $push: {
        orderStatus: newOrderStatus,
      },
    };

    const updatedOrder = await Order.findByIdAndUpdate(orderId, orderUpdate, { new: true });

    if (!updatedOrder) {
      return response.status(400).send({ message: "Failed to update order" });
    }

    response.status(200).send({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = updateUserOrderAndOrderStatus;
