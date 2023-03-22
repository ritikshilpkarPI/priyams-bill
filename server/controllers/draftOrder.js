const PurchaseOrder = require('../db-models/purchase-order-model');

const draftOrder = async (req, res) => {
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
    } catch (err) {
      console.log({ err });
      res.status(400).send({ message: err.message, success: false });
    }
  };

  module.exports = draftOrder;