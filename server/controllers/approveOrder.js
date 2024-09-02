const PurchaseOrder = require('../db-models/purchase-order-model');

const approveOrder = async (req, res,next) => {
  try {
    const id = req.params.id;
    const order = await PurchaseOrder.findByIdAndUpdate(
      id,
      {
        isApproved: true,
        approveTime:Date.now(),
      },
      { new: true }
    );
    res
      .status(200)
      .send({ message: 'order approved successfully', order, success: true });
  } catch (error) {
    next(error)
  }
};
module.exports = approveOrder;
