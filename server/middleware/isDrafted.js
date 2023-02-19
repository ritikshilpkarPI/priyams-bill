const PurchaseOrder = require('../db-models/purchase-order-model');
const isDrafted = async (req, res, next) => {
  try {
    const order = PurchaseOrder.findById(req.params.id);
    if (order && order.isDraft) {
      next();
    } else {
      res.status(400).send({ message: 'order is not drafted', success: false });
    }
  } catch (err) {
    res.status(400).send({ message: err, success: false });
  }
};
module.exports = {
  isDrafted,
};
