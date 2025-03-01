const PurchaseOrder = require('../db-models/purchase-order-model');
const { APP_ENVIRONMENT } = require('../util/constants/appEnvironment');

const draftOrder = async (req, res,next) => {
    try {
      const { id, userDetail } = req.body;
      const referer = req.headers.referer;
      const status =  APP_ENVIRONMENT.DRAFT
      const newStatusHistory =
        {
          data: {
            userId: userDetail.userId,
            status: status,
            browser: userDetail.browser || "Unknown",
            os: userDetail.os || "Unknown",
            ipAddress: userDetail.ipAddress || "Unknown",
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
      console.log({order});
      res
        .status(200)
        .send({ message: 'order drafted successfully', success: true, order });
    } catch (error) {
      console.log({error});
      next(error)
    }
  };

  module.exports = draftOrder;