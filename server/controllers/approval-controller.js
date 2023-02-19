const PurchaseOrder = require('../db-models/purchase-order-model');

const rejectOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await PurchaseOrder.findByIdAndUpdate(id, {
      isRejected: true,
    });
    res.status(200).send({ message: 'order rejected successfully', order });
  } catch (err) {
    res.status(400).send({ message: 'order rejection failed' });
  }
};
module.exports = {
  rejectOrder,
};
