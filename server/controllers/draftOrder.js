const PurchaseOrder = require('../db-models/purchase-order-model');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

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

  module.exports = {
    draftOrder,
  };