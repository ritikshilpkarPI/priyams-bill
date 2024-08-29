const PurchaseOrder = require('../db-models/purchase-order-model');
const getPurchaseOrderByPaidStatus = async (req, res) => {
  try {

    const { isPaid } = req.body;

    if (isPaid === undefined || isPaid === null) {
      return res.status(400).send({ message: 'wrong paid filter status' });
    }
    const purchaseOrders = await PurchaseOrder.find({ isPaid:false });

    res.status(200).send(purchaseOrders);
  } catch (error) {
    next(error);
  }
};

module.exports = getPurchaseOrderByPaidStatus;
