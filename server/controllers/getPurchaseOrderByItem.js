const PurchaseOrder = require('../db-models/purchase-order-model');
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const getPurchaseOrderByItem = async (req, res) => {
    const { id } = req.params;
    const itemPurchaseOrder = PurchaseOrder.aggregate([
      {
        $unwind: '$purchasedItems',
      },
      {
        $match: { 'purchasedItems.inputName': id },
      },
      {
        $group: {
          _id: '$dealerName',
          dealerId: { $first: '$_id' },
          itemDetails: { $push: '$purchasedItems' },
        },
      },
      {
        $sort: { 'itemDetails.expiryDates.date': -1 },
      },
    ]);
  
    const result = await itemPurchaseOrder;
    return res.status(200).json({ message: { result } });
  };

  module.exports = {
    getPurchaseOrderByItem,
  };