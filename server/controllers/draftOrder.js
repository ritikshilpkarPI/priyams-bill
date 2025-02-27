const PurchaseOrder = require('../db-models/purchase-order-model');

const draftOrder = async (req, res,next) => {
    try {
      const { id, userDetail } = req.body;
      const newStatusHistory =
        {
          data: {
            userId: userDetail.userId,
            status: userDetail.status,
            browser: userDetail.browser || "Unknown",
            os: userDetail.os || "Unknown",
            ipAddress: userDetail.ipAddress || "Unknown",
          },
        }
      const order = await PurchaseOrder.findByIdAndUpdate(
        id,
        {
          isDraft: true,
          isRejected: false,
          draftTime: Date.now(),
          $push: { statusHistory: newStatusHistory },
        },
        { new: true }
      );
      res
        .status(200)
        .send({ message: 'order drafted successfully', success: true, order });
    } catch (error) {
      next(error)
    }
  };

  module.exports = draftOrder;