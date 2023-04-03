const PurchaseOrder = require('../db-models/purchase-order-model');

const draftOrder = async (req, res,next) => {
    try {
      const { id } = req.body;
      const order = await PurchaseOrder.findByIdAndUpdate(
        id,
        {
          isDraft: true,
          isRejected: false,
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