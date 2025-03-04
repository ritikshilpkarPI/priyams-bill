const PurchaseOrder = require('../db-models/purchase-order-model');
const { CONSTANS } = require('../constants/constans');

const draftOrder = async (req, res,next) => {
    try {
      const { id, userDetail } = req.body;
      const referer = req.headers.referer;
      const status =  CONSTANS.DRAFT
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