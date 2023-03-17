const PurchaseOrder = require('../db-models/purchase-order-model');

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