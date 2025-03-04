const { CONSTANS } = require('../constants/constans');
const PurchaseOrder = require('../db-models/purchase-order-model');
const rejectOrder = async (req, res,next) => {
    try {
      const id = req.params.id;
      const { userDetail } = req.body;
      const referer = req.headers.referer;
      const status =  CONSTANS.REJECT
      const user = req.user;      
      const newStatusHistory =
        {
          data: {
            userId: user._id,
            status: status,
            browser: userDetail ? userDetail.browser : "Unknown",
            os:  userDetail ? userDetail.os : "Unknown",
            ipAddress: userDetail ? userDetail.ipAddress : "Unknown",
            referer: referer,
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