const PurchaseOrder = require('../db-models/purchase-order-model');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const getDetailsById = async (req, res) => {
    const id = req.params.id;
    try {
      const data = await PurchaseOrder.findById(id);
      res.status(200).send({ data });
    } catch (err) {
      console.log({ err });
      res.status(400).send({ message: err });
    }
  };

  module.exports = {
    getDetailsById,
  };