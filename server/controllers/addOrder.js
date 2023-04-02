const { uploadImages } = require('../util/image');
const PurchaseOrder = require('../db-models/purchase-order-model');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});


const addOrder = async (req, res,next) => {
    try {
      const {
        details,
        bills,
        orders,
        billAmount,
        remark,
        totalPaidAmount,
        payment,
        procurementSource,
        dealerName,
        phoneNumber,
        minimumQuantity,
      } = req.body.new_order.purchaseObj;
      const isDraft = req.body.new_order.isDraft;
  
      let billPhotos = await uploadImages(bills,cloudinary);
  
      const purchaseOrder = {
        purchasedItems: [...orders],
        purchaseDetails: [...details],
        billPhotos,
        isDraft,
        billAmount,
        remark,
        totalPaidAmount,
        payment,
        procurementSource,
        dealerName,
        phoneNumber,
        minimumQuantity,
      };
      const order = await PurchaseOrder.create(purchaseOrder);
      res.status(201).send({ message: order, success: true });
    } catch (error) {
      next(error)
    }
  };

  module.exports = addOrder;