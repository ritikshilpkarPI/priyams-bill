const PurchaseOrder = require('../db-models/purchase-order-model');
const rejectOrder = async (req, res,next) => {
    try {
      const id = req.params.id;
      const { userDetail } = req.body;
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
          isRejected: true,
          isDraft: false,
          rejectTime: Date.now(),
          $push: { statusHistory: newStatusHistory },
        },
        { new: true }
      );
      res
        .status(200)
        .send({ message: 'order rejected successfully', order, success: true });
    } catch (error) {
      next(error)
    }
  };
module.exports = rejectOrder;