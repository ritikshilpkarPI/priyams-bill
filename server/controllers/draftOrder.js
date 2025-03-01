const PurchaseOrder = require('../db-models/purchase-order-model');

const draftOrder = async (req, res,next) => {
    try {
      console.log("drafting order");
      const { id } = req.body;
      console.log({id});
      const order = await PurchaseOrder.findByIdAndUpdate(
        id,
        {
          isDraft: true,
          isRejected: false,
          draftTime: Date.now()
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