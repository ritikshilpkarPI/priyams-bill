const PurchaseOrder = require('../db-models/purchase-order-model');

const approveOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const order = await PurchaseOrder.findByIdAndUpdate(
      id,
      {
        isApproved: true,
      },
      { new: true }
    );
    res
      .status(200)
      .send({ message: 'order approved successfully', order, success: true });
  } catch (err) {
    console.log({ err });
    res.status(400).send({ message: err.message, success: false });
  }
};
module.exports = {
  approveOrder,
};
