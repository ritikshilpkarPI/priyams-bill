const PurchaseOrder = require('../db-models/purchase-order-model');
const rejectOrder = async (req, res) => {
    try {
      const id = req.params.id;
      const order = await PurchaseOrder.findByIdAndUpdate(
        id,
        {
          isRejected: true,
          isDraft: false,
        },
        { new: true }
      );
      res
        .status(200)
        .send({ message: 'order rejected successfully', order, success: true });
    } catch (err) {
      res.status(400).send({ message: err.message, success: false });
    }
  };
module.exports = rejectOrder;